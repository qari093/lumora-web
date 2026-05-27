import { NextResponse } from "next/server";
import { getOfflineJournal } from "@/src/core/zenwallet/offline/offlineTrust";

export async function GET() {
  return NextResponse.json({ ok: true, journal: getOfflineJournal() });
}
