//import { pipeline } from "@xenova/transformers"; //original import 

let embedder: any = null;

async function loadEmbedder() {
  if (!embedder) {
    /*changes to not get require() of ES Module not supported. Instead change the 
    require of transformers.js to a dynamic import() which is available in all 
    CommonJS modules.*/
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2" // free, local, 384-dim embeddings
    );
  }
  return embedder;
}

export async function embedText(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) return [];

  const model = await loadEmbedder();
  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}
