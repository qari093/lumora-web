import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  const raw = (ctx as any)?.params?.slug as any;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  if (!slug) return new NextResponse("missing slug", { status: 400 });

  const c = await prisma.celebration.findFirst({ where: { slug } });
  if (!c) return new NextResponse("not found", { status: 404 });

  const [parts, reacts, rewards] = await Promise.all([
    prisma.celebrationParticipant.findMany({ where: { celebrationId: c.id }, orderBy: { createdAt: "asc" } }),
    prisma.celebrationReaction.findMany({ where: { celebrationId: c.id }, orderBy: { createdAt: "asc" } }),
    prisma.celebrationReward.findMany({ where: { celebrationId: c.id }, orderBy: { createdAt: "asc" } }),
  ]);

  const esc = (v: any) => {
    if (v == null) return "";
    const s = String(v);
    return /[,"\n]/.test(s) ? `"${s.replace(/"/g, )}"` : s;
  };

  const rows: string[] = [];
  rows.push("section,id,userId,kind_or_type,intensity,createdAt");
  for (const p of parts) rows.push(["participants", p.id, p.userId ?? "", "", "", p.createdAt.toISOString()].map(esc).join(","));
  for (const r of reacts) rows.push(["reactions", r.id, r.userId ?? "", r.kind ?? "", r.intensity ?? "", r.createdAt.toISOString()].map(esc).join(","));
  for (const r of rewards) rows.push(["rewards", r.id, r.userId ?? "", r.type ?? "", "", r.createdAt.toISOString()].map(esc).join(","));

  const csv = rows.join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${slug}-export.csv"`,
    },
  });
}
