export async function retry<T>(fn:()=>Promise<T>, retries:number=3):Promise<T>{
  let lastErr:any;
  for(let i=0;i<retries;i++){
    try{
      return await fn();
    }catch(err){
      lastErr = err;
    }
  }
  throw lastErr;
}
