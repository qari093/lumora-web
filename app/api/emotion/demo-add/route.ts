import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
export const dynamic="force-dynamic";
const FILE="./.data/emml_events.json";
const EMOS=["focus","calm","joy","stress","neutral","anxious","bored","excited","confident","tired"];
export async function POST(){
  try{
    await mkdir("./.data",{recursive:true});
    const raw=await readFile(FILE,"utf8").catch(()=> "[]");
    const arr=JSON.parse(raw);
    const pick=EMOS[Math.floor(Math.random()*EMOS.length)];
    const intensity=Number((0.3+Math.random()*0.65).toFixed(2));
    arr.push({type:"mood",emotion:pick,intensity,meta:{via:"demo-add"},ts:Date.now()});
    await writeFile(FILE,JSON.stringify(arr,null,2));
    return NextResponse.json({ok:true,added:{emotion:pick,intensity}});
  }catch(e:any){ return NextResponse.json({ok:false,error:String(e?.message||e)},{status:500}); }
}