import { NextResponse } from "next/server";
import { readManifest } from "../../../../lib/library";
export async function GET(){ return NextResponse.json(await readManifest()); }
