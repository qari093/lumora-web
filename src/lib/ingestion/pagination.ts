export function paginate(items:any[], page:number=1, size:number=20){
  const start = (page-1)*size;
  return items.slice(start, start+size);
}
