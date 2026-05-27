import type { NativeFypVideo } from "../schema";

export type NativeFypResponse = {
  ok: boolean;
  source: "native_fyp";
  count: number;
  items: NativeFypVideo[];
};

export function buildApiResponse(items: NativeFypVideo[]): NativeFypResponse {
  return {
    ok: true,
    source: "native_fyp",
    count: items.length,
    items,
  };
}
