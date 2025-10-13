import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "creator.json");

async function loadAll(): Promise<CreatorApp[]> {
  try {
    if (!existsSync(DATA_FILE)) {
      await mkdir(DATA_DIR, { recursive: true });
      await writeFile(DATA_FILE, "[]", "utf8");
      return [];
    }
    const raw = await readFile(DATA_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

async function saveAll(rows: CreatorApp[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const id = (body?.id ?? "").toString().trim();
    const status = (body?.status ?? "").toString().trim() as CreatorApp["status"];

    const allowed: CreatorApp["status"][] = ["new","review","approved","rejected"];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json(
        { ok: false as const, error: "invalid_input", need: { id: "string", status: allowed } },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const rows = await loadAll();
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { ok: false as const, error: "not_found" },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    rows[idx].status = status;
    await saveAll(rows);

    return NextResponse.json(
      { ok: true, updated: rows[idx] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false as const, error: err?.message || "update_failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
