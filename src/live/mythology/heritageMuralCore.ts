export type HeritageMural = {
  constellationId: string;
  generatedAt: string;
  memberCount: number;
  memoryCount: number;
};

export function canGenerateHeritageMural(memberCount: number, memoryCount: number): boolean {
  return memberCount >= 3 && memoryCount >= 10;
}
