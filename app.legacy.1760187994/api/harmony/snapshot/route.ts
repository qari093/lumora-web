import { NextResponse } from "next/server";
import { snapshot } from "@/lib/econ/harmony";
export async function GET(){ return NextResponse.json(await snapshot()); }
