import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

type CreatorApp = {
  id: string;
  name: string;
  handle: string;
  category: string;
  bio?: string;
  ts: string;
  status: "new" | "review" | "approved" | "rejected";
};

const DATA_FILE = path.join(process.cwd(), "data", "creator.json");

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") ?? "10")));
    let rows: CreatorApp[] = [];
    if (existsSync(DATA_FILE)) {
      const raw = await readFile(DATA_FILE, "utf8");
      rows = JSON.parse(raw || "[]");
    }
    const out = rows.slice(0, limit);
    return NextResponse.json(
      { ok: true, count: out.length, rows: out },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false as const, error: err?.message || "list_failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
