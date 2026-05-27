import { NextResponse } from "next/server";
import {
  apiSuccess,
  buildPersistenceBoundaryReport,
  evaluatePersistenceOperation
} from "@/src/core/runtime-consolidation";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    apiSuccess({
      data: {
        report: buildPersistenceBoundaryReport(),
        sample: evaluatePersistenceOperation({
          domain: "wallet",
          operation: "write",
          requester: "WalletOrchestrator"
        })
      },
      domain: "infra_telemetry",
      version: "runtime-consolidation-pack-08",
      runtime: "node"
    })
  );
}
