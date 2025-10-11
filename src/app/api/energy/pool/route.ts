import { NextResponse } from "next/server";
import { snapshotPool } from "@/lib/energyStore";

export async function GET(){
  const res = snapshotPool();
  return NextResponse.json({ ok:true, pool: res });
}
