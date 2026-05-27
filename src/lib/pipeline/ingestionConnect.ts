export function connectIngestion(items:any[]){
  return (items || []).map(x => ({
    ...x,
    ingested: true
  }));
}
