import { Elysia } from "elysia";
import { chatRequestSchema } from "../lib/type";
import db from "../db";
import { chatListTable, chatMessagesTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { userMiddleware } from "../middlewares/auth-middleware";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { ErrorType, logger } from "../middlewares/logger";
import { getSystemPrompt } from "../prompts";
import { renderSVG } from "../tools";
import z from "zod";

export const chat = new Elysia({
  prefix: "/chat",
})
  .use(logger)
  .derive((c) => userMiddleware(c))
  .derive(({ headers }) => {
    const auth = headers["x-auto-pdf-key"];
    const bearer = auth?.startsWith("Bearer ") ? auth.substring(7) : undefined;
    return { bearer };
  })
  .derive(({ user, error: ElysiaError }) => {
    if (!user) {
      throw ElysiaError(401, { message: "Authentication required" });
    }
  })
  .post(
    "/v1",
    async ({ body, bearer, error: ElysiaError, user, log }) => {
      const openai = createOpenAI({
        apiKey: bearer,
      });
      const systemPrompt = await getSystemPrompt();
      log.info("Chat request start", { user: user.id });
      let chatListId = body.chatListId;
      let svg = "";
      let content = "";
      let summary = "";
      // 1. Get chat history
      let allMessages = [...body.messages];
      if (chatListId) {
        const historyMessages = await db
          .select()
          .from(chatMessagesTable)
          .where(eq(chatMessagesTable.chatListId, chatListId))
          .orderBy(chatMessagesTable.createdAt);

        allMessages = [
          ...historyMessages.map(({ role, content }) => ({
            role,
            content,
          })),
          ...body.messages,
        ];
      }

      // 2. generate content
      try {
        const result = await generateObject({
          model: openai("gpt-4o-mini"),
          temperature: 0,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...allMessages,
          ],
          schema: z.object({
            content: z.string(),
            summary: z
              .string()
              .describe(
                "Create a friendly, conversational summary of both the generated content and user's request. Match the user's language style and tone."
              ),
          }),
        });
        content = result.object.content;
        summary = result.object.summary;
      } catch (error) {
        log.error("Content generate failed", error, {
          errorType: ErrorType.AI,
          chatListId,
          userId: user.id,
        });
        throw ElysiaError(500, {
          message: (error as Error).message,
        });
      }

      // 3. generate SVG

      try {
        svg = await renderSVG(content);
      } catch (error) {
        log.error("SVG generation failed", null, {
          errorType: ErrorType.PDF,
          chatListId,
          userId: user.id,
        });
        throw ElysiaError(400, {
          message: "An error occurred while generating the SVG file",
        });
      }

      // 处理聊天记录
      try {
        if (content && summary && user) {
          await db.transaction(async (tx) => {
            if (!chatListId) {
              const result = await tx
                .insert(chatListTable)
                .values({
                  userId: user.id,
                  title: `${body.messages[0].content.substring(0, 30)}`,
                })
                .returning({ id: chatListTable.id });

              chatListId = result[0].id;
              log.info("Created new chat", { chatListId });
            }

            // 存储消息记录
            await tx.insert(chatMessagesTable).values([
              {
                chatListId,
                content: body.messages[0].content,
                role: "user",
              },
              {
                chatListId,
                content,
                summary,
                svg,
                role: "assistant",
              },
            ]);
          });
        }
      } catch (error) {
        log.error("Database transaction failed", error, {
          errorType: ErrorType.DB,
          chatListId,
          userId: user.id,
        });
        throw ElysiaError(500, {
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
      return {
        data: {
          chatListId,
        },
      };
    },
    {
      body: chatRequestSchema,
    }
  );
