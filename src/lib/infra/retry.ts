export async function retry(fn:()=>Promise<any>, times:number=3){
  let last;
  for(let i=0;i<times;i++){
    try{
      return await fn();
    }catch(e){
      last = e;
    }
  }
  throw last;
}
