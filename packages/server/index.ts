import { Elysia, type Context } from "elysia";
import { cors } from "@elysiajs/cors";
import { chat, download, chatList } from "./routes";
import { swagger } from "@elysiajs/swagger";
import { auth as betterAuth } from "./lib/auth";

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return betterAuth.handler(context.request);
  } else {
    context.error(405);
  }
};

const app = new Elysia({
  serve: {
    idleTimeout: 60,
  },
})
  .use(cors())
  .use(swagger())
  .get("/ping", () => "pong")
  .all("/api/auth/*", betterAuthView)
  .use(chat)
  .use(download)
  .use(chatList)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
