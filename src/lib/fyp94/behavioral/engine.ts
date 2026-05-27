export type Fyp94BehavioralItem = {
  id: string;
  category?: string;
  query?: string;
  source?: string;
  thrillScore?: number;
  mood?: string;
  behavioralSlot?: string;
  rareSurprise?: boolean;
  [key: string]: unknown;
};

export function inferFyp94Mood(item: Fyp94BehavioralItem): string {
  const q = `${item.query || ""} ${item.category || ""}`.toLowerCase();
  const thrill = Number(item.thrillScore || 0);

  if (q.includes("calm") || q.includes("nature") || q.includes("rain") || q.includes("ocean")) return "calm";
  if (q.includes("city") || q.includes("street") || q.includes("night")) return "focus";
  if (q.includes("football") || q.includes("basketball") || q.includes("parkour") || thrill >= 85) return "energy";
  if (q.includes("retro") || q.includes("archive") || q.includes("vintage")) return "curiosity";

  return "surprise";
}

export function enforceFyp94EmotionalUnpredictability<T extends Fyp94BehavioralItem>(items: T[]) {
  return items.map((item, index) => ({
    ...item,
    mood: inferFyp94Mood(item),
    behavioralSlot: index % 7 === 0 ? "surprise" : index % 3 === 0 ? "calm-reset" : "flow",
  }));
}

export function mixFyp94EnergyTransitions<T extends Fyp94BehavioralItem>(items: T[]): T[] {
  const energy = items.filter((item) => inferFyp94Mood(item) === "energy");
  const calm = items.filter((item) => inferFyp94Mood(item) === "calm");
  const other = items.filter((item) => !["energy", "calm"].includes(inferFyp94Mood(item)));

  const out: T[] = [];

  while (energy.length || calm.length || other.length) {
    const e = energy.shift();
    if (e) out.push(e);

    const c = calm.shift();
    if (c) out.push(c);

    const o = other.shift();
    if (o) out.push(o);
  }

  return out;
}

export function injectFyp94RareSurprise<T extends Fyp94BehavioralItem>(items: T[]) {
  if (items.length < 6) return items;

  const rare = items.find((item) => {
    const mood = inferFyp94Mood(item);
    return mood === "curiosity" || mood === "surprise";
  });

  if (!rare) return items;

  const filtered = items.filter((item) => item.id !== rare.id);
  const position = Math.min(5, filtered.length);

  return [
    ...filtered.slice(0, position),
    { ...rare, rareSurprise: true },
    ...filtered.slice(position),
  ];
}

export function preventFyp94PatternPredictability<T extends Fyp94BehavioralItem>(items: T[]) {
  const out: T[] = [];
  let lastMood = "";
  let streak = 0;

  for (const item of items) {
    const mood = inferFyp94Mood(item);

    if (mood === lastMood) streak += 1;
    else streak = 1;

    if (streak <= 2) {
      out.push(item);
      lastMood = mood;
      continue;
    }

    const swap = items.find((candidate) => {
      const candidateMood = inferFyp94Mood(candidate);
      return candidateMood !== mood && !out.some((x) => x.id === candidate.id);
    });

    if (swap) {
      out.push(swap);
      lastMood = inferFyp94Mood(swap);
      streak = 1;
    }
  }

  return out.length ? out : items;
}

export function buildFyp94InfiniteFreshPerception<T extends Fyp94BehavioralItem>(items: T[]) {
  return preventFyp94PatternPredictability(
    injectFyp94RareSurprise(
      enforceFyp94EmotionalUnpredictability(
        mixFyp94EnergyTransitions(items),
      ),
    ),
  );
}
