import { eventWeight } from "./eventWeight";

export function scoreSession(events:any[]){
  return (events || []).reduce((acc,e)=>{
    return acc + eventWeight(e.type);
  },0);
}
