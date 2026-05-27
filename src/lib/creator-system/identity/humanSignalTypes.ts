export type HumanSignalType =
  | "present"
  | "stillness"
  | "hold"
  | "rewatch"
  | "silent-ovation";

export type HumanSignal = {
  id: string;
  type: HumanSignalType;
  timestamp: number;
};
