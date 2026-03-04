import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveBase64File } from "@/lib/upload";

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(()=> ({}));
    const { requestId, docType, mimeType, filename, dataBase64 } = b || {};
    if (!requestId || !docType || !mimeType || !filename || !dataBase64) {
      return NextResponse.json({ ok:false, error:"INVALID_INPUT" }, { status:400 });
    }
    const reqRow = await prisma.kycRequest.findUnique({ where: { id: String(requestId) } });
    if (!reqRow) return NextResponse.json({ ok:false, error:"REQUEST_NOT_FOUND" }, { status:404 });
    if (reqRow.status !== "PENDING") return NextResponse.json({ ok:false, error:"REQUEST_NOT_PENDING" }, { status:409 });

    const b64 = String(dataBase64).includes(",") ? String(dataBase64).split(",").pop()! : String(dataBase64);
    const saved = await saveBase64File({ base64: b64, dir: `kyc/${requestId}`, filename });
    const doc = await prisma.kycDocument.create({
      data: {
        requestId: String(requestId),
        docType: String(docType),
        mimeType: String(mimeType),
        filePath: saved.path,
        original: String(filename),
        size: saved.size,
      },
    });
    return NextResponse.json({ ok:true, document: doc });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
