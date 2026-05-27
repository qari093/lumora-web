export function failover(src:string){
  if(src === "rss") return "reddit";
  if(src === "reddit") return "rss";
  if(src === "youtube") return "crawler";
  return "rss";
}
