export interface PulseState {
  userId: string;
  energy: number;
  streak: number;
  bonus: number;
  lastAction: number;
}

const userStates: Record<string, PulseState> = {};

export function getPulseState(userId: string): PulseState {
  if (!userStates[userId]) {
    userStates[userId] = { userId, energy: 100, streak: 0, bonus: 0, lastAction: Date.now() };
  }
  return userStates[userId];
}

export function applyPulseAction(userId: string, kind: "watch" | "like" | "share"): PulseState {
  const s = getPulseState(userId);
  const now = Date.now();
  const diffHr = (now - s.lastAction) / 3600000;
  if (diffHr > 24) s.streak = 0;
  s.lastAction = now;
  let delta = kind === "share" ? 5 : kind === "like" ? 3 : 2;
  s.energy = Math.min(200, s.energy + delta);
  s.streak++;
  if (s.streak % 7 === 0) s.bonus += 10;
  return s;
}

export function globalPulseEvent() {
  const hour = new Date().getHours();
  const weekend = [0,6].includes(new Date().getDay());
  const event = weekend ? "Pulse Rush Weekend" : (hour>=18 && hour<=20 ? "Energy Storm Hour" : "Calm");
  const multiplier = event==="Pulse Rush Weekend" ? 2 : event==="Energy Storm Hour" ? 1.5 : 1;
  return { event, multiplier };
}
