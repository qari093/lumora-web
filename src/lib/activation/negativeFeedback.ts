import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(),"data/negative_feedback");

export function loadNegative(userId:string){
  const f = path.join(dir,`${userId}.json`);
  if(!fs.existsSync(f)) return {};
  return JSON.parse(fs.readFileSync(f,"utf-8"));
}

export function applyNegativeFeedback(items:any[],userId:string){
  const neg = loadNegative(userId);

  return items.map(x=>{
    if(neg[x.id]){
      return {...x, final_score:(x.final_score||1)*0.6};
    }
    return x;
  });
}
