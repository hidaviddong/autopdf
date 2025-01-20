import Elysia from "elysia";
import pino from "pino";

export const pinoLogger = pino({
  transport: {
    targets: [
      {
        target: "pino/file",
        level: "info",
        options: { destination: "./app.log", mkdir: true },
      },
    ],
  },
});

export const logger = new Elysia().derive({ as: "global" }, () => ({
  log: {
    info: (msg: string, data?: object) => pinoLogger.info(data || {}, msg),
    error: (msg: string, error?: Error | unknown, data?: object) =>
      pinoLogger.error(
        {
          ...(data || {}),
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
        },
        msg
      ),
  },
}));

export const ErrorType = {
  DB: "database_error",
  AI: "ai_generation_error",
  PDF: "pdf_generation_error",
} as const;
