import fs from "fs";
import path from "path";

function loadBookmarks(userId:string){
  const dir = path.join(process.cwd(),"data/bookmarks");
  const f = path.join(dir,`${userId}.json`);
  if(!fs.existsSync(f)) return {};
  return JSON.parse(fs.readFileSync(f,"utf-8"));
}

export function applyBookmarkBoost(items:any[],userId:string){
  const b = loadBookmarks(userId);

  return items.map(x=>{
    if(b[x.id]){
      return {...x, final_score:(x.final_score||1)*1.2};
    }
    return x;
  });
}
