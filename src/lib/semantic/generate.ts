import { embedText } from "./embedder";
import { preprocess } from "./preprocess";

export async function generateEmbedding(text:string){
  const clean = preprocess(text);
  return embedText(clean);
}
