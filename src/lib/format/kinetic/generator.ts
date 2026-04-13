export type KineticTextFrame = {
  text: string;
  startMs: number;
  endMs: number;
  emphasis: "low" | "medium" | "high";
};

export function buildKineticFrames(text: string): KineticTextFrame[] {
  const parts = String(text || "")
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean);

  let cursor = 0;

  return parts.map((part, index) => {
    const duration = Math.max(900, Math.min(2600, part.length * 45));
    const frame: KineticTextFrame = {
      text: part,
      startMs: cursor,
      endMs: cursor + duration,
      emphasis: index === 0 ? "high" : "medium",
    };
    cursor += duration;
    return frame;
  });
}
