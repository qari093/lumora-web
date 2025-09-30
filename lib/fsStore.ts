import fs from "node:fs/promises";
import path from "node:path";

export async function loadJson<T>(p:string, fallback:T): Promise<T>{
  try{ const raw=await fs.readFile(p,"utf8"); return JSON.parse(raw) as T; }
  catch{ return fallback; }
}
export async function saveJson<T>(p:string, v:T){ 
  await fs.mkdir(path.dirname(p),{recursive:true}); 
  await fs.writeFile(p, JSON.stringify(v,null,2), "utf8");
}
export const dataPath = (name:string)=> path.join(process.cwd(), ".data", name);
