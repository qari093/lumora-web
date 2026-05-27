export async function withLatencyGuard(p:Promise<any>, ms:number=2000){
  return Promise.race([
    p,
    new Promise(resolve => setTimeout(()=>resolve([]), ms))
  ]);
}
