export function checkSchema(x:any, keys:string[]){
  return keys.every(k => k in (x||{}));
}
