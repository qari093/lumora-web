export function updateInterest(vec:any, topic:string, weight:number){
  if(!vec[topic]) vec[topic]=0;
  vec[topic]+=weight;
  return vec;
}
