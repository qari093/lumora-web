import { NextResponse } from "next/server";
type W={zen:number;cred:number;shards:number};
const parse=(v?:string):W=>{try{return v?JSON.parse(v) as W:{zen:3,cred:120,shards:0}}catch{return{zen:3,cred:120,shards:0}}};
const reward=(k:number,r:number,m:number)=>{const base=5,place=Math.max(0,100-r)*0.08,kill=Math.min(k,15)*0.6,surv=Math.min(Math.max(m/20,0),1)*4;return{cred:Math.round(base+place+kill+surv),zen:r===1?1:0,shards:0}};
export async function POST(req:Request){
  const body=await req.json().catch(()=>null) as {sessionId:string;stats:{kills:number;rank:number;minutes:number}}|null;
  if(!body?.sessionId) return NextResponse.json({ok:false,error:"no session"},{status:400});
  const cookies=(await import("next/headers")).cookies();
  if(!cookies.get(`rbn_s_${body.sessionId}`)?.value) return NextResponse.json({ok:false,error:"invalid session"},{status:400});
  const w=parse(cookies.get("rbn_wallet")?.value); const r=reward(body.stats.kills||0, body.stats.rank||99, body.stats.minutes||0);
  const nw:W={zen:w.zen+r.zen, cred:w.cred+r.cred, shards:w.shards+r.shards};
  const res=NextResponse.json({ok:true,reward:r,wallet:nw});
  res.cookies.set("rbn_wallet", JSON.stringify(nw), { httpOnly:false, path:"/" });
  res.cookies.set(`rbn_s_${body.sessionId}`,"",{ expires:new Date(0), path:"/" });
  return res;
}
