import fs from "fs";
import path from "path";

export function saveWatchTime(userId:string,id:string,ms:number){
  const dir="data/watch_time";
  if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});

  const f=path.join(dir,`${userId}.json`);
  let data:any={};

  if(fs.existsSync(f)){
    data=JSON.parse(fs.readFileSync(f,"utf-8"));
  }

  data[id]=(data[id]||0)+ms;

  fs.writeFileSync(f,JSON.stringify(data,null,2));
}
