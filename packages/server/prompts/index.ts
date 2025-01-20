export async function getSystemPrompt() {
  const file = Bun.file(import.meta.dir + "/index.md");
  const text = await file.text();
  return text;
}
