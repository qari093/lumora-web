export interface HeroFrame {
  id: string;
  emotion: string;
}

export interface AuraPipeline {
  id: string;
  optimized: boolean;
}

export interface AiRuntime {
  active: boolean;
  pipelineId: string;
}
