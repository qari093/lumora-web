import { NextResponse } from "next/server";
import { getPortalCards } from "@/lib/portal/getPortalCards";

export async function GET() {
  try {
    const cards = getPortalCards();
    return NextResponse.json({ ok: true, cards });
  } catch {
    return NextResponse.json(
      { ok: false, error: "portal_cards_failed" },
      { status: 500 }
    );
  }
}
