export const EMBEDDING_VERSION = "v1";

export function attachVersion(vec:any){
  return { version: EMBEDDING_VERSION, vector: vec };
}
