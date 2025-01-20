import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database(process.env.DB_FILE_NAME!);
sqlite.query("PRAGMA foreign_keys = ON;").run();
const db = drizzle(sqlite);

export default db;
