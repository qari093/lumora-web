import fs from "fs"; import { spawn } from "child_process"; import path from "path";
export function ensureDir(p){fs.mkdirSync(p,{recursive:true});}
export function exists(p){try{fs.accessSync(p);return true;}catch{return false;}}
export function safeName(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,100);}
export function run(cmd,args,opts={}){return new Promise((res,rej)=>{const p=spawn(cmd,args,{stdio:["ignore","pipe","pipe"],...opts});let e="";p.stderr.on("data",d=>e+=String(d));p.on("close",c=>c===0?res(0):rej(new Error(e||`${cmd} ${c}`)));});}
export function hasFFmpeg(){return new Promise(r=>{const p=spawn("ffmpeg",["-version"]);p.on("close",c=>r(c===0));p.on("error",()=>r(false));});}
export function writeJSON(p,obj){ensureDir(path.dirname(p));fs.writeFileSync(p,JSON.stringify(obj,null,2));}
export function readJSON(p,def=null){try{return JSON.parse(fs.readFileSync(p,"utf8"));}catch{return def;}}
