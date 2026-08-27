import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;
  try {
    const b = await req.json().catch(()=> ({}));
    const { fullName, dob, idType, idNumber, consent } = b || {};
    const ownerId = auth.identity.userId;
    if (!ownerId || typeof ownerId !== "string") {
      return NextResponse.json({ ok:false, error:"OWNER_REQUIRED" }, { status:400 });
    }
    const existing = await prisma.kycRequest.findFirst({
      where: { ownerId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return NextResponse.json({ ok:true, reused:true, request: existing });

    const created = await prisma.kycRequest.create({
      data: {
        ownerId,
        fullName: typeof fullName === "string" ? fullName : null,
        dob: typeof dob === "string" ? dob : null,
        idType: typeof idType === "string" ? idType : null,
        idNumber: typeof idNumber === "string" ? idNumber : null,
        consent: Boolean(consent),
      },
    });
    return NextResponse.json({ ok:true, request: created });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
