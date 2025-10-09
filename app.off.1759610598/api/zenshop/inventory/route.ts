import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Inv = { device: string; items: string[]; boosts?: number };
const FILE = path.join(process.cwd(), ".data/zenshop/inventory.json");

function loadAll(): Record<string, Inv> {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}
function saveAll(m: Record<string, Inv>) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(m, null, 2));
}
export async function GET(req: NextRequest) {
  const dev = (req.headers.get("x-device-id") || "dev-"+(req.headers.get("x-forwarded-for")||"127.0.0.1"));
  const all = loadAll();
  const inv = all[dev] || { device: dev, items: [], boosts: 0 };
  return NextResponse.json({ ok:true, device: dev, inventory: inv });
}
