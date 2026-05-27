import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const file = path.join(process.cwd(),"data/user_profiles/user_A.json");
    if(!fs.existsSync(file)) return NextResponse.json({ok:false},{status:404});
    const data = JSON.parse(fs.readFileSync(file,"utf-8"));
    return NextResponse.json({ok:true,data});
  } catch {
    return NextResponse.json({ok:false},{status:500});
  }
}
