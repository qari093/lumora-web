import { promises as fs } from "fs";
import path from "path";

export type LiveRoom = {
  id: string;
  title: string;
  createdAt: string; // ISO
  endedAt?: string;  // ISO
};

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, ".lumora_data");
const FILE = path.join(DATA_DIR, "live_rooms.json");

function nowIso() {
  return new Date().toISOString();
}

function cuidLike() {
  // Not a real cuid, but stable, URL-safe, collision-resistant enough for local demo.
  // Format: lr_<timestamp>_<rand>
  return `lr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify({ rooms: [] }, null, 2) + "\n", "utf8");
  }
}

async function readAll(): Promise<{ rooms: LiveRoom[] }> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try {
    const j = JSON.parse(raw);
    if (!j || typeof j !== "object" || !Array.isArray(j.rooms)) return { rooms: [] };
    return { rooms: j.rooms as LiveRoom[] };
  } catch {
    return { rooms: [] };
  }
}

async function writeAll(data: { rooms: LiveRoom[] }) {
  await ensureFile();
  const tmp = `${FILE}.tmp.${process.pid}.${Date.now()}`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, FILE);
}

export async function listRooms(): Promise<LiveRoom[]> {
  const { rooms } = await readAll();
  return rooms
    .slice()
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function listActiveRooms(): Promise<LiveRoom[]> {
  const rooms = await listRooms();
  return rooms.filter((r) => !r.endedAt);
}

export async function createRoom(input?: { title?: string }): Promise<LiveRoom> {
  const { rooms } = await readAll();
  const title = (input?.title || "Live Room").trim().slice(0, 80) || "Live Room";
  const room: LiveRoom = { id: cuidLike(), title, createdAt: nowIso() };
  rooms.push(room);
  await writeAll({ rooms });
  return room;
}

export async function endRoom(id: string): Promise<LiveRoom | null> {
  const data = await readAll();
  const idx = data.rooms.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  if (!data.rooms[idx].endedAt) data.rooms[idx].endedAt = nowIso();
  await writeAll({ rooms: data.rooms });
  return data.rooms[idx];
}

export async function getRoom(id: string): Promise<LiveRoom | null> {
  const { rooms } = await readAll();
  return rooms.find((r) => r.id === id) || null;
}
