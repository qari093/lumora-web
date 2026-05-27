export function batchIngest(items:any[], size:number=25){
  const out:any[] = [];
  for(let i=0;i<items.length;i+=size){
    out.push(items.slice(i, i+size));
  }
  return out;
}
