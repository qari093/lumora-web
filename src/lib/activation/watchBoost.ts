import fs from "fs";
import path from "path";

function loadWatch(userId:string){
  const dir = path.join(process.cwd(),"data/watch_time");
  const f = path.join(dir,`${userId}.json`);
  if(!fs.existsSync(f)) return {};
  return JSON.parse(fs.readFileSync(f,"utf-8"));
}

export function applyWatchBoost(items:any[],userId:string){
  const w = loadWatch(userId);

  return items.map(x=>{
    const ms = w[x.id] || 0;

    if(ms > 10000){
      return {...x, final_score:(x.final_score||1)*1.25};
    }

    if(ms > 3000){
      return {...x, final_score:(x.final_score||1)*1.1};
    }

    return x;
  });
}
