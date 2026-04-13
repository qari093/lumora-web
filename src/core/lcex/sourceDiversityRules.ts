export type SourceDiversityInput = {
  recentSourceIds: string[];
  candidateSourceId: string;
  maxConsecutive?: number;
  windowSize?: number;
};

export type SourceDiversityDecision = {
  allowed: boolean;
  consecutiveCount: number;
  reason: "ok" | "source_overconcentrated";
};

const DEFAULT_MAX_CONSECUTIVE = 2;
const DEFAULT_WINDOW_SIZE = 6;

function normalize(id: string): string {
  return id.trim();
}

export function resolveSourceDiversity(
  input: SourceDiversityInput
): SourceDiversityDecision {
  const maxConsecutive = input.maxConsecutive ?? DEFAULT_MAX_CONSECUTIVE;
  const windowSize = input.windowSize ?? DEFAULT_WINDOW_SIZE;

  const candidate = normalize(input.candidateSourceId);
  const window = input.recentSourceIds.slice(0, windowSize).map(normalize);

  let consecutiveCount = 0;
  for (const id of window) {
    if (id === candidate) consecutiveCount++;
    else break;
  }

  if (consecutiveCount >= maxConsecutive) {
    return {
      allowed: false,
      consecutiveCount,
      reason: "source_overconcentrated",
    };
  }

  return {
    allowed: true,
    consecutiveCount,
    reason: "ok",
  };
}

export function canInsertSourceWithDiversity(
  input: SourceDiversityInput
): boolean {
  return resolveSourceDiversity(input).allowed;
}
