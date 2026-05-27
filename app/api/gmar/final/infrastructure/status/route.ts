import { NextResponse } from "next/server";

import {
  createGmarInfrastructureNode,
  createGmarProductionInfrastructure,
  evaluateGmarInfrastructureHealth,
  assertGmarProductionInfrastructure
} from "@/src/core/gmar/final-completion/infrastructure/productionInfrastructure";

export async function GET() {
  try {
    const infrastructure = createGmarProductionInfrastructure([
      createGmarInfrastructureNode({
        nodeId: "gmar-eu-01",
        region: "eu-central",
        latencyMs: 34
      }),
      createGmarInfrastructureNode({
        nodeId: "gmar-us-01",
        region: "us-east",
        latencyMs: 82
      })
    ]);

    const status = evaluateGmarInfrastructureHealth(infrastructure);

    assertGmarProductionInfrastructure(infrastructure);

    return NextResponse.json({
      ok: true,
      status,
      infrastructure
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR infrastructure status failed."
      },
      { status: 500 }
    );
  }
}
