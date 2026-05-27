export function generateContentId(x:any){
  const base = x.url || x.title || JSON.stringify(x);
  return Buffer.from(base).toString("base64");
}
