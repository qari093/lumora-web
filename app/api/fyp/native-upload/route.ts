import { NextResponse } from "next/server";
import { validateNativeUploadInput } from "@/src/lib/native-fyp/content/uploadContract";
import { createNativeVideoId } from "@/src/lib/native-fyp/content/id";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const validation = validateNativeUploadInput(body);

  if (!validation.ok) {
    return NextResponse.json({ ok: false, reasons: validation.reasons }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    videoId: createNativeVideoId(body.filename),
    status: "accepted_for_native_fyp",
  });
}
