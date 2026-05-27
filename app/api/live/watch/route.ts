import { NextResponse } from "next/server";
import { saveWatchTime } from "@/src/lib/activation/watchTime";

export async function POST(req:Request){
  try{
    const {userId,id,ms}=await req.json();
    saveWatchTime(userId,id,ms||0);
    return NextResponse.json({ok:true});
  }catch(e:any){
    return NextResponse.json({ok:false,error:e.message},{status:500});
  }
}
