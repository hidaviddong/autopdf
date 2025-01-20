import Elysia from "elysia";
import db from "../db";
import { chatListTable, chatMessagesTable } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { userMiddleware } from "../middlewares/auth-middleware";
import { ErrorType, logger } from "../middlewares/logger";

export const chatList = new Elysia({ prefix: "/chatlist" })
  .use(logger)
  .derive((c) => userMiddleware(c))
  .derive(({ user, error: ElysiaError }) => {
    if (!user) {
      throw ElysiaError(401, { message: "Authentication required" });
    }
  })
  .get("/", async ({ error: ElysiaError, user, log }) => {
    log.info("Fetching chat lists start", { user: user.id });
    try {
      const lists = await db
        .select()
        .from(chatListTable)
        .where(eq(chatListTable.userId, user.id))
        .orderBy(desc(chatListTable.createdAt));
      log.info("Fetching chat lists end", { user: user.id });
      return {
        data: lists,
      };
    } catch (error) {
      log.error("Database query failed", error, {
        errorType: ErrorType.DB,
        userId: user.id,
        operation: "fetch_chat_lists",
      });

      throw ElysiaError(500, {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  })
  .get(
    "/:id/messages",
    async ({ params: { id }, error: ElysiaError, user, log }) => {
      log.info("Fetching chat messages start", { user: user.id, chatId: id });
      // 首先验证这个 chat 是否属于当前用户
      try {
        const chatAccess = await db
          .select()
          .from(chatListTable)
          .where(
            and(
              eq(chatListTable.id, id),
              eq(chatListTable.userId, user.id) // 验证当前用户是否是聊天的所有者
            )
          );

        if (chatAccess.length === 0) {
          throw ElysiaError(403, {
            message: "You don't have permission to access these messages",
          });
        }

        const messages = await db
          .select()
          .from(chatMessagesTable)
          .where(eq(chatMessagesTable.chatListId, id))
          .orderBy(chatMessagesTable.createdAt);
        log.info("Fetching chat messages end", { user: user.id, chatId: id });
        return {
          data: messages,
        };
      } catch (error) {
        log.error("Failed to fetch chat messages", error, {
          errorType: ErrorType.DB,
          chatId: id,
          userId: user.id,
        });
        throw ElysiaError(500, {
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  )
  .delete("/:id", async ({ params: { id }, error: ElysiaError, user, log }) => {
    log.info("Deleting chat", { user: user.id, chatId: id });
    try {
      const chat = await db
        .select({
          id: chatListTable.id,
          userId: chatListTable.userId,
        })
        .from(chatListTable)
        .where(eq(chatListTable.id, id))
        .limit(1);

      if (chat[0].userId !== user.id) {
        throw ElysiaError(403, {
          message: "You don't have permission to delete this chat",
        });
      }

      const result = await db
        .delete(chatListTable)
        .where(eq(chatListTable.id, id))
        .returning({ id: chatListTable.id });

      if (result.length === 0) {
        throw ElysiaError(404, {
          message: "Chat not found",
        });
      }
      log.info("Deleting chat end", { user: user.id, chatId: id });
      return {
        data: result[0].id,
      };
    } catch (error) {
      log.error("Failed to delete chat", error, {
        errorType: ErrorType.DB,
        chatId: id,
        userId: user.id,
      });
      throw ElysiaError(500, {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
