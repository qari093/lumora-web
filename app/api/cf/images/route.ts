// app/api/cf/images/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cors(status = 204) {
  return new Response(null, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Vary": "Origin",
    },
  });
}
export async function OPTIONS() { return cors(204); }

export async function POST(req: Request) {
  const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const API_TOKEN  = process.env.CLOUDFLARE_API_TOKEN;
  if (!ACCOUNT_ID || !API_TOKEN) {
    return NextResponse.json({ ok: false, error: "Missing Cloudflare credentials" }, { status: 500 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as unknown as File | null;
  if (!file) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("file", file, (file as any).name || "upload.png");

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: upstream,
  });

  const cf = await res.json().catch(() => ({}));
  if (!res.ok || (cf as any)?.success === false) {
    const msg =
      (cf as any)?.errors?.[0]?.message ||
      (cf as any)?.error ||
      res.statusText ||
      "Upload failed";
    return NextResponse.json({ ok: false, error: msg, cf }, { status: 502 });
  }
  return NextResponse.json({ ok: true, cf }, { status: 200 });
}
