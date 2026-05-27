const errors:any[] = [];

export function logError(e:any){
  errors.push({ e, ts: Date.now() });
}

export function getErrors(){
  return errors;
}
