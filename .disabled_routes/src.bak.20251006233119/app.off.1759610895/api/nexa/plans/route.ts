export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { listPlans } from "../../../../lib/nexaStore";

export async function GET(_req: NextRequest){
  return Response.json({ ok:true, plans:listPlans() });
}
