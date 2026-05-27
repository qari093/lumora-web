export async function runWorker(task:()=>Promise<any>){
  try{
    return await task();
  }catch(e){
    return { error: true };
  }
}
