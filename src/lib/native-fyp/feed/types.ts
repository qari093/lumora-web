import type { NativeFypVideo } from "../schema";

export type NativeFypFeedResponse = {
  ok: true;
  source: "native_fyp";
  count: number;
  items: NativeFypVideo[];
  fallback?: "events";
};
