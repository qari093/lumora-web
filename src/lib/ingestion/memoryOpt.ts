export function trimItem(x:any){
  return {
    id: x?.id,
    title: x?.title,
    source: x?.source,
    ts: x?.ts || Date.now()
  };
}

export function trimItems(items:any[]){
  return (items || []).map(trimItem);
}
