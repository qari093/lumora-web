import { NextResponse } from "next/server";
import {
  runCreatorAlchemyLaunchGates,
  summarizeLaunchReadiness
} from "@/src/core/creator-alchemy/launch";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = runCreatorAlchemyLaunchGates();

  return NextResponse.json({
    ok: report.ok,
    status: report.status,
    summary: summarizeLaunchReadiness(report),
    report
  });
}
