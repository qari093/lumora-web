import { NextResponse } from "next/server";
import { balance } from "@/lib/econ/zen";
export async function GET(){ return NextResponse.json({ balance: await balance() }); }
