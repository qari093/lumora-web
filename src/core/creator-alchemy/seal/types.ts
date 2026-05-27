export type SealArea =
  | "foundation"
  | "dashboard"
  | "whisper"
  | "constellation"
  | "economy"
  | "safety"
  | "mythic"
  | "legacy"
  | "atmosphere"
  | "revenue"
  | "infra";

export interface SealCheck {
  area: SealArea;
  ok: boolean;
  reason: string;
}

export interface CivilizationSealReport {
  ok: boolean;
  completedAreas: SealArea[];
  failedAreas: SealCheck[];
  seal: "LUMORA_CREATOR_ALCHEMY_CIVILIZATION_SEAL" | "FAILED";
}
