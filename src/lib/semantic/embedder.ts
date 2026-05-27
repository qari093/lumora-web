export async function embedText(text:string):Promise<number[]>{
  // placeholder vector
  return Array(128).fill(0).map((_,i)=> (text.length % (i+1)) / 100);
}
