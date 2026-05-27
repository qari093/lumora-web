import type { NativeFypVideo } from "../schema";

export function ensurePlayable(items: NativeFypVideo[]): NativeFypVideo[] {
  return items.filter(v => !!v.playbackUrl && !!v.posterUrl);
}
