import { NextResponse } from "next/server";
type W={zen:number;cred:number;shards:number};
const parse=(v?:string):W=>{try{return v?JSON.parse(v) as W:{zen:3,cred:120,shards:0}}catch{return{zen:3,cred:120,shards:0}}};
export async function GET(){ const c=(await import("next/headers")).cookies(); return NextResponse.json(parse(c.get("rbn_wallet")?.value)); }
