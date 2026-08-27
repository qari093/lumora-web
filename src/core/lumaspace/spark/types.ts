export interface Spark {
  id: string;
  emotion: string;
  duration: number;
}

export interface SparkEcho {
  id: string;
  parentSparkId: string;
}

export interface SparkRuntime {
  active: boolean;
  sparkId: string;
}

export type LumaSpark = any;
export type SparkRenderPlan = { sparkId: string; playable: boolean; loop: boolean; mode: "poetic" | "cinematic" };
