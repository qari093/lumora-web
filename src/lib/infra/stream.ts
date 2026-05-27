export async function streamProcess(items:any[], fn:(x:any)=>any){
  const out:any[] = [];
  for(const x of items||[]){
    out.push(await fn(x));
  }
  return out;
}
