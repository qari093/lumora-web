import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { ensureIndex } from "../../../lib/search";

export async function GET(){
  const out:any = { ok:true, deps:{ db:"unknown", search:"unknown", mode: process.env.LUMORA_NO_DOCKER==="1" ? "NO_DOCKER" : "DOCKER_OR_CLOUD" } };
  try{ await prisma.$queryRaw`select 1`; out.deps.db="up"; }catch{ out.deps.db="down"; out.ok=false; }
  try{ await ensureIndex(); out.deps.search="up"; }catch{ out.deps.search="down"; out.ok=false; }
  return NextResponse.json(out, { status: out.ok?200:503 });
}
