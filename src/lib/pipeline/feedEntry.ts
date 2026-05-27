export function feedEntry(input:any){
  return {
    user: input?.user || "anon",
    ts: Date.now(),
    items: input?.items || []
  };
}
