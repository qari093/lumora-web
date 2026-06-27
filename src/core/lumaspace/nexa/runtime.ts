export type NexaMood = "wonder" | "calm" | "dream" | "focus" | "healing" | "shadow";
export type NexaWhisperKind = "homecoming" | "garden" | "story" | "echo" | "mask" | "memory";

export type NexaWhisper = {
  id: string;
  kind: NexaWhisperKind;
  mood: NexaMood;
  message: string;
  gentle: boolean;
};

export type NexaGuidance = {
  mood: NexaMood;
  gardenHint: string;
  storyHint: string;
  echoHint: string;
};

export const nexaWhispers: NexaWhisper[] = [
  { id: "home-1", kind: "homecoming", mood: "wonder", message: "Welcome home. Your story continues.", gentle: true },
  { id: "garden-1", kind: "garden", mood: "calm", message: "Your garden feels quiet today. Stay here as long as you need.", gentle: true },
  { id: "story-1", kind: "story", mood: "dream", message: "A small star from your dream path is glowing.", gentle: true },
  { id: "echo-1", kind: "echo", mood: "healing", message: "This memory may be ready for an Echo.", gentle: true },
  { id: "mask-1", kind: "mask", mood: "shadow", message: "Your Inner Self is private. Nothing leaves without you.", gentle: true }
];

export function getNexaWhisper(kind: NexaWhisperKind, mood: NexaMood = "wonder"): NexaWhisper {
  return (
    nexaWhispers.find((whisper) => whisper.kind === kind && whisper.mood === mood) ||
    nexaWhispers.find((whisper) => whisper.kind === kind) ||
    nexaWhispers[0]
  );
}

export function createNexaGuidance(mood: NexaMood): NexaGuidance {
  return {
    mood,
    gardenHint:
      mood === "calm"
        ? "Let the water lilies stay still."
        : mood === "healing"
          ? "Let the blossoms return slowly."
          : "Let the nebula flowers open at their own pace.",
    storyHint:
      mood === "shadow"
        ? "Some stars are allowed to stay hidden."
        : "Your story grows one meaningful star at a time.",
    echoHint:
      mood === "healing"
        ? "A soft Echo may help this memory breathe."
        : "Record only what feels true."
  };
}

export function isNexaHumanFirst(text: string): boolean {
  return !/followers|likes|views|rank|viral score/i.test(text);
}
