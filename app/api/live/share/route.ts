import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { userId, id } = await req.json();

    if (!userId || !id) {
      return NextResponse.json({ ok:false, error:"invalid" }, { status:400 });
    }

    const dir = path.join(process.cwd(), "data/share_events");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive:true });

    const f = path.join(dir, `${userId}.json`);
    let data:any = {};

    if (fs.existsSync(f)) {
      data = JSON.parse(fs.readFileSync(f, "utf-8"));
    }

    data[id] = (data[id] || 0) + 1;

    fs.writeFileSync(f, JSON.stringify(data, null, 2));

    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e.message }, { status:500 });
  }
}
