import { NextResponse } from "next/server";
import { statsToday } from "../../../lib/econ/harmony";

export async function GET(){
  const s = await statsToday();
  return NextResponse.json(s);
}
