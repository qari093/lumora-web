import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toCsvRow(fields: (string | number | null | undefined)[]) {
  return fields
    .map((v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(",");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") || "500"), 5000);
  const sinceParam = searchParams.get("since"); // ISO like 2025-11-01T00:00:00Z
  const lastHours = Number(searchParams.get("hours") || "24");

  const where: any = {};
  if (sinceParam) {
    const d = new Date(sinceParam);
    if (!isNaN(d.getTime())) where.createdAt = { gte: d };
  } else if (lastHours > 0) {
    where.createdAt = { gte: new Date(Date.now() - lastHours * 3600 * 1000) };
  }

  const rows = await prisma.emmlEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const header = ["createdAt","type","emotion","intensity","userId","source","meta"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      toCsvRow([
        r.createdAt.toISOString(),
        r.type,
        r.emotion ?? "",
        r.intensity ?? "",
        r.userId ?? "",
        r.source ?? "",
        r.meta ? JSON.stringify(r.meta) : "",
      ])
    ),
  ];
  const body = lines.join("\n");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="emml_${Date.now()}.csv"`,
      "cache-control": "no-store",
    },
  });
}
