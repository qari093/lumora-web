import fs from "fs";
import path from "path";
const DATA = ".data/users";
function file(dev:string){ return path.join(DATA, dev+".json"); }
export function loadProfile(dev:string){ try{ return JSON.parse(fs.readFileSync(file(dev),"utf-8")); }catch{return {username:"seed1",bio:"",avatar:"",uploads:0};} }
export function saveProfile(dev:string,p:any){ fs.mkdirSync(DATA,{recursive:true}); fs.writeFileSync(file(dev),JSON.stringify(p,null,2)); }
