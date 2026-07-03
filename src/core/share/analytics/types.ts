export type ShareAnalyticsEventKind =
  | "created"
  | "opened"
  | "transformed"
  | "delivered"
  | "viewed"
  | "reshared"
  | "saved"
  | "echo_played"
  | "memory_planted"
  | "conversation_started"
  | "purchase_influenced";

export type ShareAnalyticsEvent = {
  id: string;
  shareId: string;
  actorId: string;
  kind: ShareAnalyticsEventKind;
  portal: string;
  mood?: string;
  timestamp: string;
  weight: number;
};

export type RippleNode = {
  id: string;
  shareId: string;
  portal: string;
  actorId: string;
  depth: number;
  influence: number;
};

export type RippleEdge = {
  from: string;
  to: string;
  strength: number;
};

export type RippleGraph = {
  shareId: string;
  nodes: RippleNode[];
  edges: RippleEdge[];
  totalInfluence: number;
};

export type ShareQualityMetrics = {
  shareId: string;
  emotionalDepth: number;
  relationshipFit: number;
  portalFit: number;
  creatorValue: number;
  serenityScore: number;
  overallQuality: number;
};

export type ShareInsight = {
  id: string;
  shareId: string;
  title: string;
  detail: string;
  severity: "info" | "positive" | "warning";
};
