import { NATIVE_FYP_MAX_DOM_VIDEO_CARDS } from "./budget";

export function validateVideoCardCount(count: number): {
  ok: boolean;
  count: number;
  max: number;
} {
  return {
    ok: count <= NATIVE_FYP_MAX_DOM_VIDEO_CARDS,
    count,
    max: NATIVE_FYP_MAX_DOM_VIDEO_CARDS,
  };
}
