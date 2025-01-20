import { $ } from "bun";

await Promise.all([
  $`cd packages/client && bun run build`,
  $`cd packages/server && bun run build`,
]);
