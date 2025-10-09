export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { markProgress } from "../../../../../lib/nexaStore";

export async function POST(req: NextRequest){
  const device = req.headers.get("x-device-id") || "dev1";
  const body = await req.json().catch(()=>({}));
  const done = !!body?.done;
  const result = markProgress(device, done, body?.metrics);
  return Response.json({ ok:true, ...result });
}
