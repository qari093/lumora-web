import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Demo routes are disabled in locked launch plan.
// Keep this endpoint returning 404 to avoid any accidental bypass paths.
export async function GET(_req: NextRequest) {
  return new Response("Not Found", { status: 404 });
}
