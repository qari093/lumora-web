export async function runParallel(tasks:(()=>Promise<any>)[]){
  return Promise.all(tasks.map(t => t()));
}
