import { NextResponse } from "next/server";

export type CompatibilityPayload = {
  ok: boolean;
  deprecated: boolean;
  canonical: string;
  alias: string;
  message: string;
};

export function compatibilityJson(alias: string, canonical: string) {
  return NextResponse.json(
    {
      ok: true,
      deprecated: true,
      alias,
      canonical,
      message: "This endpoint is a compatibility alias. Use the canonical endpoint."
    } satisfies CompatibilityPayload,
    {
      status: 200,
      headers: {
        "x-lumora-route-alias": alias,
        "x-lumora-canonical-route": canonical,
        "cache-control": "no-store"
      }
    }
  );
}
