import fs from "fs";
import path from "path";

function loadShares(userId:string){
  const dir = path.join(process.cwd(),"data/share_events");
  const f = path.join(dir,`${userId}.json`);
  if(!fs.existsSync(f)) return {};
  return JSON.parse(fs.readFileSync(f,"utf-8"));
}

export function applyShareBoost(items:any[],userId:string){
  const shares = loadShares(userId);

  return items.map(x=>{
    const s = shares[x.id] || 0;

    if(s >= 3){
      return {...x, final_score:(x.final_score||1)*1.3};
    }

    if(s >= 1){
      return {...x, final_score:(x.final_score||1)*1.15};
    }

    return x;
  });
}
