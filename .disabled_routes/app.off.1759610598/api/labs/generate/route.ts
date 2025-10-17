
import { NextResponse } from "next/server";
type Effects = {
  beautify: boolean;
  ageShift: number;
  hairstyle: string | null;
  genderStyle: "any" | "masc" | "fem";
  music: string | null;
  captions: boolean;
  translateTo: string | null;
  gestures: string[];
  avatarPreset: string | null;
};
type Body = { mode: "video" | "image"; effects: Effects };
export async function POST(req: Request){
  const body = (await req.json().catch(()=>({}))) as Partial<Body>;
  if(!body?.mode || !body?.effects){
    return NextResponse.json({ ok:false, error:"missing mode/effects" }, { status:400 });
  }
  return NextResponse.json({ ok:true, jobId: "job_"+Date.now() });
}
