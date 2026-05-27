export function pickNode(nodes:string[], key:string=""){
  if(!nodes.length) return null;
  const hash = key.split("").reduce((a,c)=>a + c.charCodeAt(0), 0);
  return nodes[hash % nodes.length];
}
