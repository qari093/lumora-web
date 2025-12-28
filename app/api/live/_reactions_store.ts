import { promises as fs } from "fs";
import path from "path";

export type LiveReaction = {
  id: string;
  roomId: string;
  kind: "emoji" | "avatar";
  // For emoji: payload can be an emoji string or an id; for avatar: url or id
  payload: string;
  createdAt: string; // ISO
};

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, ".lumora_data");
const FILE = path.join(DATA_DIR, "live_reactions.json");

function nowIso() {
  return new Date().toISOString();
}

function rid() {
  return `rx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify({ reactions: [] }, null, 2) + "\n", "utf8");
  }
}

async function readAll(): Promise<{ reactions: LiveReaction[] }> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try {
    const j = JSON.parse(raw);
    if (!j || typeof j !== "object" || !Array.isArray(j.reactions)) return { reactions: [] };
    return { reactions: j.reactions as LiveReaction[] };
  } catch {
    return { reactions: [] };
  }
}

async function writeAll(data: { reactions: LiveReaction[] }) {
  await ensureFile();
  const tmp = `${FILE}.tmp.${process.pid}.${Date.now()}`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, FILE);
}

export async function listRoomReactions(roomId: string, limit = 60): Promise<LiveReaction[]> {
  const { reactions } = await readAll();
  return reactions
    .filter((r) => r.roomId === roomId)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, Math.max(1, Math.min(200, limit)));
}

export async function addReaction(input: { roomId: string; kind: LiveReaction["kind"]; payload: string }): Promise<LiveReaction> {
  const data = await readAll();
  const reaction: LiveReaction = {
    id: rid(),
    roomId: input.roomId,
    kind: input.kind,
    payload: String(input.payload || "").slice(0, 500),
    createdAt: nowIso(),
  };
  data.reactions.push(reaction);
  // Keep file bounded
  if (data.reactions.length > 2000) data.reactions = data.reactions.slice(-1600);
  await writeAll({ reactions: data.reactions });
  return reaction;
}
