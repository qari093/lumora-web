export type FypDoctrineStatus =
  | "locked"
  | "active"
  | "deprecated";

export type EmotionalSpectrum =
  | "comfort"
  | "drift"
  | "chaos"
  | "deep"
  | "energy"
  | "focus"
  | "wonder";

export interface CivilizationDoctrine {
  readonly status: FypDoctrineStatus;
  readonly creatorFirst: true;
  readonly trustRequired: true;
  readonly antiManipulation: true;
  readonly synchronizedAtmospheres: true;
}
