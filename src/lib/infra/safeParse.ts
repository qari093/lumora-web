export function safeParse(s:string){
  try{
    return JSON.parse(s);
  }catch{
    return null;
  }
}
