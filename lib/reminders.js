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
