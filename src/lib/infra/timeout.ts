export async function withTimeout(p:Promise<any>, ms:number=2000){
  return Promise.race([
    p,
    new Promise((_,rej)=>setTimeout(()=>rej("timeout"), ms))
  ]);
}
