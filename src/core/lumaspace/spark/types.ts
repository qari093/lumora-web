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
