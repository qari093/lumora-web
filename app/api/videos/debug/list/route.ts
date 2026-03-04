export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic"; export const revalidate = 0;
export async function GET(){ const rows = await prisma.video.findMany({ orderBy:{ createdAt:"desc" }, take:10 }); return NextResponse.json({ ok:true, rows }); }
