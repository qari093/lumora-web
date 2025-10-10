import { NextResponse } from "next/server";
import { loadHarmony } from "../_loader";

export async function GET(){
  const { statsToday } = await loadHarmony();
  const s = await statsToday();
  return NextResponse.json(s);
}
