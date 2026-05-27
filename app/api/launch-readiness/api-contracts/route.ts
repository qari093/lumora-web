import { NextResponse } from "next/server";

import {
  buildApiContractHardeningReport
} from "@/src/core/launch-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildApiContractHardeningReport(),
    meta: {
      domain: "launch_readiness",
      phase: "04",
      category: "api_contract_hardening"
    }
  });
}
