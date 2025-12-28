import { NextResponse } from "next/server";
import { listPersonaExpansionPacks } from "@/lib/persona/expansions";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ packs: listPersonaExpansionPacks() }, { status: 200 });
}
