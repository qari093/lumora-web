import { NextResponse } from "next/server";
import { checkFeedAliveness } from "@/src/content-engine/zencast";
import { getSeedContentRegistry } from "@/src/content-engine/registry";

export async function GET() {
  const poolSize = getSeedContentRegistry().length;

  return NextResponse.json(
    checkFeedAliveness({
      poolSize,
      freshPoolSize: poolSize,
    }),
  );
}
