import { generateEmbedding } from "./generate";

export async function batchEmbed(texts:string[]){
  const out = [];
  for(const text of texts){
    out.push(await generateEmbedding(text));
  }
  return out;
}
