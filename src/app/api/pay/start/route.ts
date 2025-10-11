import { NextResponse } from "next/server";
import { setPro } from "@/lib/entitlements";
export async function POST(){ setPro(true); return NextResponse.json({ ok:true, pro:true }); }
