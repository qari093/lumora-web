import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED_TIERS = new Set(["TIER1", "TIER2", "TIER3"]);

type Body = { ownerId?: string; targetTier?: string; note?: string };

export async function POST(req: Request) {
  try {
    const { ownerId, targetTier, note }: Body = await req.json().catch(() => ({} as Body));

    if (!ownerId) {
      return NextResponse.json({ ok: false, error: "ownerId is required" }, { status: 400 });
    }
    if (!targetTier || !ALLOWED_TIERS.has(targetTier)) {
      return NextResponse.json(
        { ok: false, error: `targetTier must be one of: ${[...ALLOWED_TIERS].join(", ")}` },
        { status: 400 }
      );
    }

    const acc =
      (await prisma.userAccount.findFirst({ where: { ownerId } })) ??
      (await prisma.userAccount.create({
        data: { ownerId, tier: "TIER0", status: "ACTIVE" },
      }));

    const submission = await prisma.kycSubmission.create({
      data: {
        ownerId,
        status: "SUBMITTED",
        requestedTier: targetTier,
        note: note?.slice(0, 1000) ?? null,
      },
      select: { id: true, status: true, createdAt: true },
    });

    await prisma.userAccount.update({
      where: { id: acc.id },
      data: { status: "PENDING" },
    });

    return NextResponse.json({
      ok: true,
      ownerId,
      requestedTier: targetTier,
      currentTier: acc.tier,
      newStatus: "PENDING",
      submissionId: submission.id,
      requestId: Math.random().toString(36).slice(2),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
