import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(req: Request) {
  const t = req.headers.get("x-admin-token") || "";
  return !!t && t === (process.env.ADMIN_TOKEN || "");
}

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ ok:false, error:"UNAUTHORIZED" }, { status:401 });
    const b = await req.json().catch(()=> ({}));
    const { requestId, decision, reason, adminUser } = b || {};
    if (!requestId || !decision || !["APPROVED","REJECTED"].includes(decision)) {
      return NextResponse.json({ ok:false, error:"INVALID_INPUT" }, { status:400 });
    }
    const updated = await prisma.kycRequest.update({
      where: { id: String(requestId) },
      data: {
        status: decision as any,
        reason: typeof reason === "string" ? reason : null,
        adminUser: typeof adminUser === "string" ? adminUser : "admin",
      },
    });
    return NextResponse.json({ ok:true, request: updated });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
