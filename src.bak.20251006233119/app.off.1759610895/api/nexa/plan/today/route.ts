export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { today } from "../../../../../lib/nexaStore";

export async function GET(req: NextRequest){
  const device = req.headers.get("x-device-id") || "dev1";
  const t = today(device);
  return Response.json({ ok:true, ...t });
}
