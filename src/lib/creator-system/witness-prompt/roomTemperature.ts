import type { WitnessPromptResponse } from "./promptResponse";
import type { WitnessPromptWord } from "./oneWordPrompt";

export function aggregateRoomTemperature(responses: WitnessPromptResponse[]) {
  const counts: Record<WitnessPromptWord, number> = {
    still: 0,
    warm: 0,
    curious: 0,
    heavy: 0,
    amused: 0,
  };

  for (const response of responses) {
    counts[response.word] += 1;
  }

  const dominant = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "still") as WitnessPromptWord;

  return {
    total: responses.length,
    counts,
    dominant,
    label: `room-${dominant}`,
  };
}
