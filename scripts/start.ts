import { $ } from "bun";

await Promise.all([
  $`cd packages/client && bun run start`,
  $`cd packages/server && bun run start`,
]);
