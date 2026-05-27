import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(),"data/impressions");

export function applyCTRBoost(items:any[],userId:string){
  const f = path.join(dir,`${userId}.json`);
  if(!fs.existsSync(f)) return items;

  const impressions = JSON.parse(fs.readFileSync(f,"utf-8"));

  return items.map(x=>{
    const imp = impressions[x.id] || 1;
    const clicks = x.clicks || 0;

    const ctr = clicks / imp;

    return {
      ...x,
      final_score:(x.final_score||1)*(1 + ctr)
    };
  });
}
