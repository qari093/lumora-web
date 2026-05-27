export function selectVariant(userId:string){
  const hash = userId.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  return hash % 2 === 0 ? "A" : "B";
}
