import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";

const pdfCompiler = NodeCompiler.create();
pdfCompiler.evictCache(10);

function preprocessTypstContent(content: string): string {
  return content.replace(/(?<!\\)@/g, "\\@");
}

export async function renderSVG(mainFileContent: string) {
  try {
    const svg = pdfCompiler.svg({
      mainFileContent: preprocessTypstContent(mainFileContent),
    });
    return svg;
  } catch (error) {
    throw new Error("Failed to render SVG");
  }
}

export async function renderPDF(mainFileContent: string) {
  try {
    const pdf = pdfCompiler.pdf({
      mainFileContent: preprocessTypstContent(mainFileContent),
    });

    return pdf;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to render PDF");
  }
}
