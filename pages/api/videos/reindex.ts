import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs"; import path from "path";
export default function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const pub = path.join(process.cwd(),"public","videos");
    const files = fs.readdirSync(pub).filter(f=>f.endsWith(".mp4"));
    const items = files.map(f=>({ slug:f.replace(/\.mp4$/,""), file:`/videos/${f}`, created: fs.statSync(path.join(pub,f)).mtimeMs }));
    fs.writeFileSync(path.join(pub,"index.json"), JSON.stringify({count:items.length, items: items.sort((a,b)=>b.created-a.created)}, null, 2));
    res.status(200).json({ ok:true, count:items.length });
  }catch(e:any){
    res.status(500).json({ ok:false, error:e.message });
  }
}
