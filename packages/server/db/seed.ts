// seed.ts
import { eq } from "drizzle-orm";
import db from ".";
import { chatListTable, chatMessagesTable, user } from "./schema";

// 模拟用户ID，实际使用时需要替换为真实用户ID
const MOCK_USER_ID = "mock-user-1";

// 首先确保测试用户存在
async function ensureTestUser() {
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.id, MOCK_USER_ID))
    .limit(1);

  if (existingUser.length === 0) {
    await db.insert(user).values({
      id: MOCK_USER_ID,
      name: "Test User",
      email: "test@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return MOCK_USER_ID;
}

async function createChat(userId: string, title: string) {
  return await db
    .insert(chatListTable)
    .values({
      title,
      userId, // 添加用户ID
    })
    .returning();
}

async function addMessage(
  chatListId: string,
  content: string,
  role: "user" | "assistant"
) {
  return await db.insert(chatMessagesTable).values({
    chatListId,
    content,
    role,
  });
}

// 获取特定用户的聊天列表
async function getChatList(userId: string) {
  return await db
    .select()
    .from(chatListTable)
    .where(eq(chatListTable.userId, userId))
    .orderBy(chatListTable.updatedAt);
}

// 使用示例
async function main() {
  // 确保测试用户存在
  const userId = await ensureTestUser();

  // 创建一个新聊天
  const result = await createChat(userId, "我的第一个聊天");
  console.log("Created chat:", result);

  // 添加一条消息
  await addMessage(result[0].id, "你好！", "user");

  // 获取用户的所有聊天
  const chats = await getChatList(userId);
  console.log("All chats:", chats);
}

main().catch(console.error);
