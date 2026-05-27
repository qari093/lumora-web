export function shapeMonetizationTraffic(input: {
  mode: "normal" | "protective";
  userState: "green" | "yellow" | "red";
}) {
  if (input.mode === "protective") {
    return {
      allowNativeAds: input.userState === "green",
      allowRewardAds: false,
      allowExitInteraction: false,
    };
  }

  return {
    allowNativeAds: input.userState !== "red",
    allowRewardAds: input.userState === "green",
    allowExitInteraction: input.userState === "green",
  };
}
