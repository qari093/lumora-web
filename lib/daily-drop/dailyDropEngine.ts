export type DailyDrop = {
  id: string;
  title: string;
  expiresAt: number;
  lane: string;
};

export function createDailyDrop(): DailyDrop {
  const now = Date.now();

  return {
    id: "daily-drop",
    title: "Daily Emotional Drop",
    expiresAt: now + 86400000,
    lane: "silent-wonder"
  };
}

export function isDropExpired(drop: DailyDrop): boolean {
  return Date.now() > drop.expiresAt;
}
