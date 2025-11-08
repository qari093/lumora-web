import { NextResponse } from "next/server";
import { saveUpload } from "@/app/_modules/hybrid/uploads";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("photo");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: "missing file 'photo'" }, { status: 400 });
    }
    const meta = await saveUpload(file);
    return NextResponse.json({ ok: true, id: meta.id, filename: meta.filename, bytes: meta.size }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
