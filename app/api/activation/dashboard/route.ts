import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const matrixPath = path.join(process.cwd(), "docs/activation/LIVE_READINESS_MATRIX.csv");

  let matrix = "missing";
  if (fs.existsSync(matrixPath)) {
    matrix = fs.readFileSync(matrixPath, "utf-8");
  }

  return Response.json({
    ok: true,
    data: {
      activationDashboard: true,
      readinessMatrix: matrix,
      status: "baseline-phase",
      rule: "no engine is live until proof gates pass"
    },
    ts: Date.now()
  });
}
