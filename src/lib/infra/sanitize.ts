export function sanitize(x:any){
  if(typeof x === "string"){
    return x.replace(/[<>]/g,"");
  }
  return x;
}
