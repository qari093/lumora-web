import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma: any = new PrismaClient();

// Which wallet to charge for CPV (demo default)
const CPV_OWNER_ID = process.env.CPV_OWNER_ID || "OWNER_A";

// Fallback: 50¢ per view if Campaign has no cpv field
async function getCostPerViewCents(campaign: any): Promise<number> {
  const direct = Number(campaign?.costPerViewCents);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const alt = Number(campaign?.cpvCents ?? campaign?.cpmCents);
  if (Number.isFinite(alt) && alt > 0) return alt;
  return 50;
}

export async function POST(req: NextRequest) {
  try {
    const { campaignId, idempotencyKey } = (await req.json().catch(() => ({}))) as {
      campaignId?: string;
      idempotencyKey?: string;
    };

    if (!campaignId || !idempotencyKey) {
      return NextResponse.json(
        { ok: false, charged: false, error: "missing_fields", need: ["campaignId", "idempotencyKey"] },
        { status: 400 }
      );
    }

    // 0) Strong idempotency BEFORE anything else: look for an existing CPV ledger for this key
    //    This requires NO schema changes and prevents double-charging immediately.
    const already = await prisma.walletLedger.findFirst({
      where: { refType: "CPV", refId: String(idempotencyKey) },
      orderBy: { createdAt: "desc" },
    });
    if (already) {
      return NextResponse.json(
        {
          ok: true,
          charged: false,
          idempotent: true,
          ledgerId: already.id,
          walletId: already.walletId,
          idempotencyKey,
        },
        { status: 200 }
      );
    }

    // 1) Find Campaign
    const campaign = await prisma.campaign.findUnique?.({ where: { id: String(campaignId) } }).catch(() => null);
    if (!campaign) {
      return NextResponse.json(
        { ok: false, charged: false, error: "campaign_not_found", campaignId },
        { status: 404 }
      );
    }

    // 2) Cost
    const costCents = await getCostPerViewCents(campaign);

    // 3) Charge + record atomically
    const result = await prisma.$transaction(async (tx: any) => {
      // Double-check idempotency inside the transaction too (avoids quick double taps)
      const again = await tx.walletLedger.findFirst({
        where: { refType: "CPV", refId: String(idempotencyKey) },
        orderBy: { createdAt: "desc" },
      });
      if (again) {
        return {
          ok: true as const,
          charged: false as const,
          idempotent: true,
          ledgerId: again.id,
          walletId: again.walletId,
          idempotencyKey,
        };
      }

      // Ensure wallet exists (EUR)
      let wallet = await tx.wallet.findFirst({ where: { ownerId: CPV_OWNER_ID, currency: "EUR" } });
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { ownerId: CPV_OWNER_ID, currency: "EUR", balanceCents: 0 },
        });
      }

      if (Number(wallet.balanceCents) < costCents) {
        return {
          ok: false as const,
          charged: false as const,
          reason: "insufficient_funds",
          requiredCents: costCents,
          balanceCents: Number(wallet.balanceCents),
          walletId: wallet.id,
          campaignId,
        };
      }

      // (Optional) record a view if your schema has cpvView — best-effort
      let view: any = null;
      try {
        view = await tx.cpvView?.create?.({
          data: { campaignId: String(campaignId), idempotencyKey: String(idempotencyKey) },
        });
      } catch {
        // If the table doesn't exist, ignore.
      }

      // Ledger entry — **idempotency key goes into refId**
      const ledger = await tx.walletLedger.create({
        data: {
          wallet: { connect: { id: wallet.id } },
          type: "TRANSFER_OUT",
          amountCents: costCents,
          refType: "CPV",
          refId: String(idempotencyKey), // ← key for idempotency
          note: "cost-per-view",
        },
      });

      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balanceCents: { decrement: costCents } },
      });

      return {
        ok: true as const,
        charged: true as const,
        costCents,
        walletId: wallet.id,
        ledgerId: ledger.id,
        balanceAfterCents: Number(updated.balanceCents),
        viewId: view?.id ?? null,
        idempotencyKey,
      };
    });

    // Normalize status
    if (result?.ok && result?.charged) return NextResponse.json(result, { status: 200 });
    if (result?.idempotent) return NextResponse.json(result, { status: 200 });
    if (result?.reason === "insufficient_funds") return NextResponse.json(result, { status: 402 });

    return NextResponse.json({ ok: false, charged: false, error: "unknown_error" }, { status: 500 });
  } catch (err: any) {
    console.error("CPV_TRACK_ERROR", err?.message || err);
    return new NextResponse("cpv error", { status: 500 });
  }
}