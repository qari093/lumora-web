export function topicConfidence(x:any){
  const topics = x.topics || [];
  return { ...x, topic_conf: topics.length / 5 };
}
