export type HubEvent =
  | { type: "score"; value: number }
  | { type: "coins"; delta: number }
  | { type: "death" }
  | { type: "levelComplete"; meta?: any };

export type HubCallbacks = {
  emit: (ev: HubEvent) => void;
};

export type HubSettings = {
  difficulty: "easy" | "normal" | "hard";
  sfx?: boolean;
  haptics?: boolean;
  leftHanded?: boolean;
};

export type EngineProps = {
  paused?: boolean;
  settings: HubSettings;
} & HubCallbacks;

export type ReactEngine = (props: EngineProps) => JSX.Element;
