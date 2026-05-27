export function reinforce(interests:any, key:string, weight:number=1){
  if(!interests[key]) interests[key]=0;
  interests[key]+=weight;
  return interests;
}
