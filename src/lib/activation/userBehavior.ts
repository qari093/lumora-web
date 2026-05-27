import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(),"data/user_behavior");

export function loadBehavior(userId:string){
  const f = path.join(dir,`${userId}.json`);
  if(!fs.existsSync(f)) return {};
  return JSON.parse(fs.readFileSync(f,"utf-8"));
}

export function saveBehavior(userId:string,entry:any){
  const f = path.join(dir,`${userId}.json`);
  let data:any = {};
  if(fs.existsSync(f)){
    data = JSON.parse(fs.readFileSync(f,"utf-8"));
  }
  data[entry.id] = entry;
  fs.writeFileSync(f,JSON.stringify(data,null,2));
}
