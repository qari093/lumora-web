import type { PersonalLimits } from "./personalLimits";

export async function fetchPersonalLimits(): Promise<PersonalLimits | null> {
  try {
    const res = await fetch("/api/safety/personal-limits", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.limits ?? null;
  } catch {
    return null;
  }
}

export async function savePersonalLimits(input: Partial<PersonalLimits>): Promise<PersonalLimits | null> {
  try {
    const res = await fetch("/api/safety/personal-limits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.limits ?? null;
  } catch {
    return null;
  }
}
