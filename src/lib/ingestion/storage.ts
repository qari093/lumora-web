const rawStore:any[] = [];
const processedStore:any[] = [];

export function storeRaw(items:any[]){
  rawStore.push(...items);
}

export function storeProcessed(items:any[]){
  processedStore.push(...items);
}

export function getRaw(){ return rawStore; }
export function getProcessed(){ return processedStore; }
