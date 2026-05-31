export type ChronicleScope = "personal" | "community" | "relationship" | "legacy";

export type ChronicleMoment = {
  id: string;
  sourceMemoryId: string;
  title: string;
  summary: string;
  emotionalWeight: number;
  contributionWeight: number;
  connectionWeight: number;
};

export type ChronicleTemplate = {
  id: string;
  scope: ChronicleScope;
  tone: "quiet_pride" | "celebration" | "reflection" | "legacy";
  maxMoments: number;
  musicSeed: string;
};

export type ChronicleStory = {
  id: string;
  ownerId: string;
  scope: ChronicleScope;
  monthKey: string;
  title: string;
  moments: ChronicleMoment[];
  narration: string;
  durationSeconds: number;
  shareable: boolean;
  invitationLine: string;
};

export type ChronicleRenderPlan = {
  storyId: string;
  format: "vertical_short";
  resolution: "720x1280";
  templateId: string;
  estimatedCost: "low" | "medium";
  segments: Array<{
    momentId: string;
    durationMs: number;
    caption: string;
  }>;
};
