import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(),"data/impressions");

export function saveImpression(userId:string,id:string){
  if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});

  const f = path.join(dir,`${userId}.json`);
  let data:any = {};

  if(fs.existsSync(f)){
    data = JSON.parse(fs.readFileSync(f,"utf-8"));
  }

  data[id] = (data[id]||0)+1;

  fs.writeFileSync(f,JSON.stringify(data,null,2));
}
