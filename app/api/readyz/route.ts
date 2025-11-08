import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const runtime = "nodejs";
function has(v?: string | null) { return Boolean(v && v.trim().length > 0); }
export async function GET() {
  const started = Date.now();
  let dbOk = false, dbError: string | null = null;
  try { await prisma.$queryRaw`SELECT 1`; dbOk = true; } catch (e:any) { dbOk = false; dbError = String(e?.message || e); }
  const env = {
    stripe: has(process.env.STRIPE_SECRET_KEY),
    cloudflare: has(process.env.CF_ACCOUNT_ID) && has(process.env.CF_API_TOKEN),
    adminToken: has(process.env.ADMIN_TOKEN),
    databaseUrl: has(process.env.DATABASE_URL),
  };
  const ok = dbOk && env.databaseUrl;
  return NextResponse.json({ ok, dbOk, dbError, env, latencyMs: Date.now() - started, ts: Date.now() }, { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } });
}
