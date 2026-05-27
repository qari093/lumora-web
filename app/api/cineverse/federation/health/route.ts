import { NextResponse } from "next/server";
import { cineverseFederationProviders } from "@/src/cineverse/federation/providers";

export async function GET() {
  return NextResponse.json({
    ok: true,
    providers: cineverseFederationProviders,
  });
}
