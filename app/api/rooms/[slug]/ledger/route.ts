import { NextResponse } from "next/server";
import { getLedger } from "../../../../../lib/ledgerStore";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const ledger = getLedger(slug);
  return NextResponse.json({ room: slug, ...ledger });
}
