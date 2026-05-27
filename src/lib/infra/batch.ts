export function batch(items:any[], size:number=10){
  const out:any[] = [];
  for(let i=0;i<items.length;i+=size){
    out.push(items.slice(i,i+size));
  }
  return out;
}
