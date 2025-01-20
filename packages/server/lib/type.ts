import { t } from "elysia";
const chatRequestSchema = t.Object({
  chatListId: t.Optional(t.String()),
  messages: t.Array(
    t.Object({
      role: t.Union([
        t.Literal("assistant"),
        t.Literal("user"),
        t.Literal("system"),
        t.Literal("data"),
      ]),
      content: t.String(),
    })
  ),
});

const downloadRequestSchema = t.Object({
  mainFileContent: t.String(),
});

export { chatRequestSchema, downloadRequestSchema };
