
import { NextResponse } from "next/server";
type Body = { postTitle: string; earnOnShare?: boolean };
export async function POST(req: Request){
  const body = (await req.json().catch(()=>({}))) as Partial<Body>;
  if(!body?.postTitle){
    return NextResponse.json({ ok:false, error:"postTitle required" }, { status:400 });
  }
  return NextResponse.json({ ok:true, postId:"post_"+Date.now(), earned: body.earnOnShare ? 2 : 0 });
}
