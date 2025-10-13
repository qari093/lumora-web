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
    const name = (body?.name ?? "").toString().trim();
    const handle = (body?.handle ?? "").toString().trim();
    const category = (body?.category ?? "").toString().trim();
    const bio = (body?.bio ?? "").toString().trim();

    if (!name || !handle || !category) {
      return NextResponse.json(
        { ok: false as const, error: "missing_fields", need: ["name","handle","category"] },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const rows = await loadAll();
    const app: CreatorApp = {
      id: "cr_" + Date.now().toString(36),
      name,
      handle,
      category,
      bio: bio || undefined,
      ts: new Date().toISOString(),
      status: "new",
    };
    rows.unshift(app);
    await saveAll(rows);

    return NextResponse.json(
      { ok: true, saved: app },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false as const, error: err?.message || "apply_failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
