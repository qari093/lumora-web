export const revalidate = 3600;
export const dynamic = "force-static";
import { NextResponse } from "next/server";
import manifest from "../manifest";

export const runtime = "edge";

export async function GET() {
  return new NextResponse(JSON.stringify(manifest), {
    status: 200,
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}
