export function similarity(a:any, b:any){
  const keys = new Set([...Object.keys(a||{}), ...Object.keys(b||{})]);
  let dot = 0, na = 0, nb = 0;

  for(const k of keys){
    const va = a[k] || 0;
    const vb = b[k] || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }

  if(na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
