import { NextResponse } from "next/server";
import {
  buildCreatorCommerceStorefront,
  createCreatorCommerceItem,
  evaluateCreatorCommerceTrust,
  canActivateCreatorCommerce
} from "@/src/core/creator-alchemy/creator-commerce";

export const dynamic = "force-dynamic";

export async function GET() {
  const trust = evaluateCreatorCommerceTrust({
    creatorId: "demo-creator",
    verified: true,
    refundSafe: true,
    moderationSafe: true
  });

  const item = createCreatorCommerceItem({
    id: "demo-item",
    creatorId: "demo-creator",
    type: "digital_collectible",
    title: "Quiet Echo Collectible",
    price: 12,
    zencoinEligible: true,
    safetyApproved: true
  });

  const storefront = buildCreatorCommerceStorefront({
    creatorId: "demo-creator",
    zendoroReady: true,
    items: [item]
  });

  return NextResponse.json({
    ok: canActivateCreatorCommerce(trust),
    trust,
    storefront
  });
}
