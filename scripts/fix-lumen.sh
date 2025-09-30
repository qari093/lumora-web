#!/usr/bin/env bash
set -Eeuo pipefail

# Stop dev server if running
p=$(lsof -ti:3000 2>/dev/null || true)
if [ -n "${p:-}" ]; then kill -9 $p || true; fi

# Ensure reminders store exists and is valid JSON
mkdir -p .data
if [ ! -f .data/reminders.json ]; then
  echo "[]" > .data/reminders.json
else
  node -e "try{JSON.parse(require('fs').readFileSync('.data/reminders.json','utf8'));process.exit(0)}catch(e){process.exit(1)}" \
    || (cp .data/reminders.json .data/reminders.bak.$(date +%s).json && echo "[]" > .data/reminders.json)
fi

# Remove any TS versions to avoid mixed route modules
rm -f app/api/lumen/reminders/route.ts app/api/lumen/ical/route.ts lib/reminders.ts 2>/dev/null || true

# Shared reminders lib (plain ESM JS)
cat > lib/reminders.js <<'JS'
import { promises as fs } from "node:fs";
import path from "node:path";

async function filePath() {
  return path.join(process.cwd(), ".data", "reminders.json");
}

export async function readAll() {
  const p = await filePath();
  try {
    const raw = await fs.readFile(p, "utf8");
    const val = JSON.parse(raw);
    return Array.isArray(val) ? val : [];
  } catch {
    try { await fs.mkdir(path.dirname(p), { recursive: true }); } catch {}
    try { await fs.writeFile(p, "[]", "utf8"); } catch {}
    return [];
  }
}

export async function writeAll(items) {
  const p = await filePath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(items, null, 2), "utf8");
}

export async function listReminders() {
  const items = await readAll();
  return items.sort((a,b)=> new Date(a.whenISO).getTime() - new Date(b.whenISO).getTime());
}

export async function createReminder(input) {
  const items = await readAll();
  const id = "r_" + Math.random().toString(36).slice(2,10);
  const r = {
    id,
    title: String(input.title),
    whenISO: String(input.whenISO),
    repeat: input.repeat || "NONE",
    createdAt: new Date().toISOString(),
    enabled: input.enabled ?? true
  };
  items.push(r);
  await writeAll(items);
  return r;
}

export async function removeReminder(id) {
  const items = await readAll();
  const next = items.filter(x => x.id !== id);
  const changed = next.length !== items.length;
  if (changed) await writeAll(next);
  return changed;
}

export async function setEnabled(id, enabled) {
  const items = await readAll();
  const idx = items.findIndex(x=>x.id===id);
  if (idx<0) return false;
  items[idx].enabled = !!enabled;
  await writeAll(items);
  return true;
}
JS

# /api/lumen/reminders (Node runtime, ESM JS)
cat > app/api/lumen/reminders/route.js <<'JS'
import { NextResponse } from "next/server";
import { listReminders, createReminder, removeReminder, setEnabled } from "../../../../lib/reminders.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try{
    const items = await listReminders();
    return NextResponse.json({ ok: true, items }, { status: 200 });
  }catch(e){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}

export async function POST(req) {
  try{
    let body = {};
    try{ body = await req.json(); }catch{}
    if (!body?.title || !body?.whenISO) {
      return NextResponse.json({ ok:false, error:"title and whenISO required" }, { status:400 });
    }
    const r = await createReminder({ title: body.title, whenISO: body.whenISO, repeat: body.repeat || "NONE", enabled: body.enabled ?? true });
    return NextResponse.json({ ok:true, item: r }, { status: 201 });
  }catch(e){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}

export async function DELETE(req) {
  try{
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok:false, error:"id required" }, { status:400 });
    const done = await removeReminder(id);
    return NextResponse.json({ ok: done }, { status: 200 });
  }catch(e){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}

export async function PUT(req) {
  try{
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const enabled = searchParams.get("enabled");
    if (!id || enabled==null) return NextResponse.json({ ok:false, error:"id and enabled required" }, { status:400 });
    const ok = await setEnabled(id, enabled==="true");
    return NextResponse.json({ ok }, { status: 200 });
  }catch(e){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}
JS

# /api/lumen/ical (Node runtime, ESM JS)
cat > app/api/lumen/ical/route.js <<'JS'
import { NextResponse } from "next/server";
import { listReminders } from "../../../../lib/reminders.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function esc(s){ return String(s).replace(/([,;])/g,"\\$1"); }

export async function GET(){
  try{
    const items = (await listReminders()).filter(r=>r.enabled!==false);
    const lines = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("VERSION:2.0");
    lines.push("PRODID:-//NEXA Lumen//Reminders//EN");
    for(const r of items){
      const dt = new Date(r.whenISO);
      const dtUTC = new Date(dt.getTime() - dt.getTimezoneOffset()*60000)
        .toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${r.id}@lumen-nexa`);
      lines.push(`DTSTAMP:${dtUTC}`);
      lines.push(`DTSTART:${dtUTC}`);
      lines.push(`SUMMARY:${esc(r.title)}`);
      if (r.repeat && r.repeat !== "NONE") {
        const map = { DAILY:"FREQ=DAILY", WEEKLY:"FREQ=WEEKLY", MONTHLY:"FREQ=MONTHLY" };
        lines.push(`RRULE:${map[r.repeat] || "FREQ=DAILY"}`);
      }
      lines.push("END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    const text = lines.join("\r\n");
    return new NextResponse(text, { status:200, headers: { "Content-Type":"text/calendar; charset=utf-8" }});
  }catch(e){
    return new NextResponse("BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n", { status:200, headers: { "Content-Type":"text/calendar; charset=utf-8" }});
  }
}
JS

# Clean build & start in foreground so logs are visible
chmod -R u+w .next 2>/dev/null || true
rm -rf .next || true
echo "Starting Next.js in foreground (Ctrl+C to stop)…"
npm run dev
