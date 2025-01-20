import { $ } from "bun";

await Promise.all([
  $`cd packages/client && bun run dev`,
  $`cd packages/server && bun run dev`,
]);
