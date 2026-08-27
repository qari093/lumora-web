export type GenStatus = "queued" | "scripting" | "assembling" | "rendering" | "done" | "failed";

export type GenAspect = "9:16" | "1:1" | "16:9";

export type GenRequest = {
  prompt: string;
  categories?: string[];
  language?: string;
  targetDurationSec?: number;
  aspect?: GenAspect;
  allowAIStock?: boolean;
  voice?: string;
  captions?: boolean;
  music?: string;
  userId?: string;
};

export type GenPlan = {
  primary: string;
  hook: string;
  cta?: string;
  hashtags: string[];
  [key: string]: unknown;
};

export type GenJob = {
  id: string;
  req: GenRequest;
  lang: string;
  plan: GenPlan;
  script: {
    lines: Array<{ t: number; text: string }>;
    brollCues: string[];
    sfxCues: string[];
    musicCue?: string;
  };
  assets: {
    clips: string[];
    font?: string;
    musicPath?: string;
    voicePath?: string;
    subtitlesSrt?: string;
    hashtags: string[];
  };
  status: GenStatus;
  outPath?: string;
  error?: string;
};
