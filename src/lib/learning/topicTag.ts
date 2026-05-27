import { extractKeywords } from "./topicModel";

export function tagTopics(x:any){
  const keys = extractKeywords(x.title || "");
  return { ...x, topics: keys };
}
