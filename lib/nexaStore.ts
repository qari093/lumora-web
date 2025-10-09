import fs from "fs";
import path from "path";

//==============================
// ✅ DB FILE PATH + LOAD / SAVE
//==============================
const dbFile = path.join(process.cwd(), "data", "nexa.json");
if (!fs.existsSync(path.dirname(dbFile))) fs.mkdirSync(path.dirname(dbFile), { recursive: true });

let db: any = { users: {} };

try {
  if (fs.existsSync(dbFile)) db = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
} catch {
  db = { users: {} };
}

function saveDB() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

//==============================
// ✅ CLIENTS (SSE LIVE FEED)
//==============================
const clients: Record<string, { id: string; write: (data: string) => void }> = {};

export function addClient(id: string, write: (data: string) => void) {
  clients[id] = { id, write };
}
export function removeClient(id: string) {
  delete clients[id];
}
export function emit(event: string, payload: any) {
  const data = `event: ${event}\ndata: ${JSON.stringify({ event, payload, at: Date.now() })}\n\n`;
  Object.values(clients).forEach((c) => {
    try {
      c.write(data);
    } catch {}
  });
}

//==============================
// ✅ USER HELPERS
//==============================
function user(deviceId: string) {
  if (!db.users[deviceId]) {
    db.users[deviceId] = {
      device: deviceId,
      xp: 0,
      level: 1,
      waterMl: 0,
      waterGoalMl: 2500,
      badges: [],
      planId: null,
      dayIndex: 0,
      streak: 0,
      lastDoneAt: 0,
      lastHydrationAt: 0,
    };
  }
  return db.users[deviceId];
}

//==============================
// ✅ XP / LEVEL SYSTEM
//==============================
export function addXP(deviceId: string, amount: number) {
  const u = user(deviceId);
  u.xp += amount;
  const newLevel = Math.floor(u.xp / 100) + 1;
  if (newLevel > u.level) {
    u.level = newLevel;
    emit("xp:levelup", { device: deviceId, level: newLevel });
  }
  emit("xp:gain", { device: deviceId, xp: u.xp });
  saveDB();
  return { ok: true, xp: u.xp, level: u.level };
}

//==============================
// ✅ HYDRATION TRACKER
//==============================
export function addWater(deviceId: string, ml: number) {
  const u = user(deviceId);
  u.waterMl += ml;
  u.lastHydrationAt = Date.now();
  if (u.waterMl >= u.waterGoalMl && !u.badges.includes("Hydration Hero")) {
    u.badges.push("Hydration Hero");
    emit("badge:new", { device: deviceId, badge: "Hydration Hero" });
  }
  emit("hydrate:add", { device: deviceId, ml: u.waterMl });
  saveDB();
  return { ok: true, waterMl: u.waterMl, goal: u.waterGoalMl };
}

//==============================
// ✅ BREATHING SESSION
//==============================
export function addBreath(deviceId: string, type: string, seconds: number) {
  const u = user(deviceId);
  addXP(deviceId, Math.floor(seconds / 5));
  emit("breath:done", { device: deviceId, type, seconds });
  saveDB();
  return { ok: true, type, seconds };
}

//==============================
// ✅ BADGE SYSTEM
//==============================
export function addBadge(deviceId: string, badge: string) {
  const u = user(deviceId);
  if (!u.badges.includes(badge)) {
    u.badges.push(badge);
    emit("badge:new", { device: deviceId, badge });
  }
  saveDB();
  return { ok: true, badges: u.badges };
}

//==============================
// ✅ WEEKLY REFLECTION
//==============================
export function weeklyReflect(deviceId: string) {
  const u = user(deviceId);
  u.xp += 50;
  u.waterMl = 0;
  emit("weekly:reflect", { device: deviceId, weekXP: 50 });
  saveDB();
  return { ok: true, weekXP: 50, totalXP: u.xp };
}

//==============================
// ✅ SUMMARY
//==============================
export function getSummary(deviceId: string) {
  const u = user(deviceId);
  const pct = Math.min(100, Math.round((u.waterMl / u.waterGoalMl) * 100));
  return {
    ok: true,
    device: deviceId,
    xp: u.xp,
    level: u.level,
    waterMl: u.waterMl,
    waterGoalMl: u.waterGoalMl,
    waterPct: pct,
    badges: u.badges,
    streak: u.streak,
    planId: u.planId,
  };
}

export { db };
