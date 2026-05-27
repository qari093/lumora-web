import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(),"data/session_memory");

export function loadSession(userId:string){
  const f = path.join(dir,`${userId}.json`);
  if(!fs.existsSync(f)) return [];
  return JSON.parse(fs.readFileSync(f,"utf-8"));
}

export function saveSession(userId:string,feed:any[]){
  const f = path.join(dir,`${userId}.json`);
  fs.writeFileSync(f,JSON.stringify(feed.slice(0,20),null,2));
}
