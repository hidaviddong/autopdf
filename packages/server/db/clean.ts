// clean.ts
import db from ".";
import {
  chatListTable,
  chatMessagesTable,
  user,
  session,
  account,
  verification,
} from "./schema";

async function clearDatabase() {
  console.log("Starting database cleanup...");

  try {
    // First clear dependent tables
    await db.delete(chatMessagesTable);
    console.log("✓ Chat messages cleared");

    await db.delete(chatListTable);
    console.log("✓ Chat list cleared");

    // Clear authentication related tables
    await db.delete(verification);
    console.log("✓ Verification records cleared");

    await db.delete(session);
    console.log("✓ Session records cleared");

    await db.delete(account);
    console.log("✓ Account records cleared");

    await db.delete(user);
    console.log("✓ User records cleared");

    console.log("Database cleanup completed!");
  } catch (error) {
    console.error("Error during database cleanup:", error);
  }
}

clearDatabase();
