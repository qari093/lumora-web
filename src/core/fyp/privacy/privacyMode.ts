import type {
  PrivacyMode
} from "../trust/types";

export type PrivacyState = {
  userId: string;
  mode: PrivacyMode;
  anonymousSignals: boolean;
  locationVisible: boolean;
};

export function createPrivacyState(input: {
  userId: string;
  mode: PrivacyMode;
}): PrivacyState {
  return {
    userId: input.userId,
    mode: input.mode,
    anonymousSignals:
      input.mode === "ghost" ||
      input.mode === "phantom",
    locationVisible:
      input.mode === "public"
  };
}
