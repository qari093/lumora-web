import { NextResponse } from "next/server";
import { issueReferral } from "@/lib/referral";
export async function GET(){ const { code } = await issueReferral(); return NextResponse.json({ ok:true, code }); }
