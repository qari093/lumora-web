export function compressPayload(x:any){
  return JSON.stringify(x);
}

export function decompressPayload(s:string){
  return JSON.parse(s);
}
