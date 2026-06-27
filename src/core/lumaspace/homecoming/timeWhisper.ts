export type HomecomingPeriod = "morning" | "afternoon" | "evening" | "night";

export function getHomecomingPeriod(hour: number): HomecomingPeriod {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 24) return "evening";
  return "night";
}

export function getHomecomingWhisper(hour = new Date().getHours()): string {
  const period = getHomecomingPeriod(hour);

  if (period === "morning") return "Good morning. A new chapter awaits.";
  if (period === "afternoon") return "Welcome home. Your story continues.";
  if (period === "evening") return "The universe is quiet tonight. You are safe here.";

  return "The stars are watching over you.";
}

export function getHomecomingAtmosphere(hour = new Date().getHours()): "soft" | "dim" {
  return getHomecomingPeriod(hour) === "night" ? "dim" : "soft";
}
