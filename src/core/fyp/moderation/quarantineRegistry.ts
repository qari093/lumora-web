export interface QuarantineRecord {
  videoId: string;
  reason: string;
}

const REGISTRY: QuarantineRecord[] = [];

export function addToQuarantine(
  videoId: string,
  reason: string
) {
  REGISTRY.push({
    videoId,
    reason
  });
}

export function getQuarantineRegistry() {
  return REGISTRY;
}
