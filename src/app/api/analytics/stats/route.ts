import { NextResponse } from "next/server";
import { stats } from "@/lib/analyticsMem";
export async function GET(){ return NextResponse.json({ ok:true, stats: stats() }); }
