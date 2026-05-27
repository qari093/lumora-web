import type { CreatorAlchemyEvent } from "./types";

export const DEMO_CREATOR_ID = "demo-creator";

export const DEMO_CREATOR_ALCHEMY_EVENTS: CreatorAlchemyEvent[] = [
  {
    id: "e1",
    creatorId: DEMO_CREATOR_ID,
    viewerId: "viewer-1",
    videoId: "video-1",
    type: "watch",
    timestampSeconds: 40,
    durationMs: 12000,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "e2",
    creatorId: DEMO_CREATOR_ID,
    viewerId: "viewer-1",
    videoId: "video-1",
    type: "rewatch",
    timestampSeconds: 42,
    durationMs: 6000,
    createdAt: "2026-01-01T00:01:00.000Z"
  },
  {
    id: "e3",
    creatorId: DEMO_CREATOR_ID,
    viewerId: "viewer-2",
    videoId: "video-1",
    type: "rewatch",
    timestampSeconds: 44,
    durationMs: 5000,
    createdAt: "2026-01-01T00:02:00.000Z"
  },
  {
    id: "e4",
    creatorId: DEMO_CREATOR_ID,
    viewerId: "viewer-3",
    videoId: "video-1",
    type: "quiet_gift",
    giftType: "candle",
    createdAt: "2026-01-01T00:03:00.000Z"
  },
  {
    id: "e5",
    creatorId: DEMO_CREATOR_ID,
    viewerId: "viewer-4",
    videoId: "video-1",
    type: "save",
    createdAt: "2026-01-01T00:04:00.000Z"
  }
];
