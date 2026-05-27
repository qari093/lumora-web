export function pickVariant(userId:string){
  const h = String(userId||"").split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  return h % 2 === 0 ? "A" : "B";
}
