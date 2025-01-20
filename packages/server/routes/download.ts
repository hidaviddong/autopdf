import { Elysia } from "elysia";
import { downloadRequestSchema } from "../lib/type";
import { userMiddleware } from "../middlewares/auth-middleware";
import { ErrorType, logger } from "../middlewares/logger";
import { renderPDF } from "../tools";

export const download = new Elysia({ prefix: "/download" })
  .use(logger)
  .derive((c) => userMiddleware(c))
  .derive(({ user, error: ElysiaError }) => {
    if (!user) {
      throw ElysiaError(401, { message: "Authentication required" });
    }
  })
  .post(
    "/",
    async ({ body, set, error: ElysiaError, user, log }) => {
      log.info("PDF generation start", { user: user.id });
      const { mainFileContent } = body;

      if (!mainFileContent) {
        throw ElysiaError(500, { message: "Main file content is required" });
      }

      try {
        const pdf = await renderPDF(mainFileContent);
        set.headers["content-type"] = "application/pdf";
        set.headers["content-disposition"] =
          `attachment; filename="result.pdf"`;
        log.info("PDF generation end", { user: user.id });
        return pdf;
      } catch (error) {
        log.error("PDF generation failed", error, {
          errorType: ErrorType.PDF,
          userId: user?.id,
        });
        throw ElysiaError(500, { message: "PDF Download Error" });
      }
    },
    {
      body: downloadRequestSchema,
    }
  );
