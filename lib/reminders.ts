import fs from "node:fs/promises";
import path from "node:path";

export type Reminder = {
  id: string;
  title: string;
  whenISO: string;
  repeat?: "NONE"|"DAILY"|"WEEKLY"|"MONTHLY";
  createdAt: string;
  enabled: boolean;
};

const filePath = () => path.join(process.cwd(), ".data", "reminders.json");

async function readAll(): Promise<Reminder[]> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    const arr = JSON.parse(raw) as Reminder[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
async function writeAll(items: Reminder[]) {
  await fs.mkdir(path.dirname(filePath()), { recursive: true });
  await fs.writeFile(filePath(), JSON.stringify(items, null, 2), "utf8");
}

export async function listReminders(): Promise<Reminder[]> {
  const items = await readAll();
  return items.sort((a,b)=> new Date(a.whenISO).getTime() - new Date(b.whenISO).getTime());
}
export async function createReminder(input: Omit<Reminder,"id"|"createdAt"|"enabled"> & { enabled?:boolean }): Promise<Reminder> {
  const items = await readAll();
  const id = "r_" + Math.random().toString(36).slice(2,10);
  const r: Reminder = {
    id,
    title: input.title,
    whenISO: input.whenISO,
    repeat: input.repeat || "NONE",
    createdAt: new Date().toISOString(),
    enabled: input.enabled ?? true
  };
  items.push(r);
  await writeAll(items);
  return r;
}
export async function removeReminder(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter(x => x.id !== id);
  const changed = next.length !== items.length;
  if (changed) await writeAll(next);
  return changed;
}
export async function setEnabled(id: string, enabled: boolean): Promise<boolean> {
  const items = await readAll();
  const idx = items.findIndex(x=>x.id===id);
  if (idx<0) return false;
  items[idx].enabled = enabled;
  await writeAll(items);
  return true;
}
