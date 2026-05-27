export function extractTopic(title:string){
  return (title || "").toLowerCase().split(" ").slice(0,2).join("-");
}
