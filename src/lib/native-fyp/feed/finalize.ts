import type { NativeFypVideo } from "../schema";
import { dedupeFeed } from "./dedupe";
import { enforceDiversity } from "./diversity";

export function finalizeFeed(items: NativeFypVideo[]): NativeFypVideo[] {
  const deduped = dedupeFeed(items);
  const diversified = enforceDiversity(deduped);
  return diversified.slice(0, 20);
}
