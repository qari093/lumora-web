export function backfillIngestion(history:any[], missingIds:string[]){
  const wanted = new Set(missingIds || []);
  return (history || []).filter(x => wanted.has(String(x.id)));
}
