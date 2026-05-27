import { NextResponse } from "next/server";
import { createStorageKey } from "@/src/core/uploads/storage-key";
import { validateUploadFile } from "@/src/core/uploads/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.creatorId || !body?.filename || !body?.type || !body?.sizeBytes) {
    return NextResponse.json({ ok: false, error: "INVALID_UPLOAD_REQUEST" }, { status: 400 });
  }

  const validation = validateUploadFile({ type: body.type, sizeBytes: Number(body.sizeBytes) });

  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: "UPLOAD_NOT_ALLOWED", validation }, { status: 400 });
  }

  const key = createStorageKey({ creatorId: body.creatorId, filename: body.filename });

  return NextResponse.json({
    ok: true,
    upload: {
      key,
      method: "PUT",
      signedUrl: `/api/dev-upload/${encodeURIComponent(key)}`,
    },
  });
}
