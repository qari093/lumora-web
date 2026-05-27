import fs from "fs";
import path from "path";

const file = path.join(process.cwd(),"data/feedback/feedback.json");

export function saveFeedback(entry:any){
  let arr:any[] = [];
  if(fs.existsSync(file)){
    arr = JSON.parse(fs.readFileSync(file,"utf-8"));
  }
  arr.push(entry);
  fs.writeFileSync(file,JSON.stringify(arr,null,2));
}

export function loadFeedback(){
  if(!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file,"utf-8"));
}
