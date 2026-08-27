import { NextResponse } from "next/server";

import { getPublicConstitutionArchiveSnapshot } from
  "@/src/core/governance/publicConstitutionArchive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const archive = getPublicConstitutionArchiveSnapshot();

  return NextResponse.json(
    {
      ok: true,
      archive,
    },
    {
      status: 200,
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=60",
      },
    },
  );
}
