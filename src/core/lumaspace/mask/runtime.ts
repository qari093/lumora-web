export type LumaMaskMode = "public" | "inner";

export type LumaMaskState = {
  mode: LumaMaskMode;
  label: "Public Self" | "Inner Self";
  atmosphere: string;
  private: boolean;
};

export function createMaskState(mode: LumaMaskMode = "public"): LumaMaskState {
  if (mode === "inner") {
    return {
      mode,
      label: "Inner Self",
      atmosphere: "dark nebula, hidden echoes, private dreams",
      private: true
    };
  }

  return {
    mode,
    label: "Public Self",
    atmosphere: "bright stars, shared worlds, open memories",
    private: false
  };
}

export function toggleMaskMode(mode: LumaMaskMode): LumaMaskMode {
  return mode === "public" ? "inner" : "public";
}
