import { NextResponse } from "next/server";

import { getGovernancePublicNoticeSnapshot } from "@/src/core/governance/governancePublicNotice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const changeLog = getGovernancePublicNoticeSnapshot();

  return NextResponse.json(
    {
      ok: true,
      changeLog,
      accountability: {
        publicNoticeRequiredForPublishedGovernanceChanges: true,
        appendOnlyHistoryRequired: true,
        silentRemovalAllowed: false,
        silentRewriteAllowed: false,
      },
    },
    {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
