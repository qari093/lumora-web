export function validateMomentCardRendering(card: any) {
  const ok = Boolean(
    card?.visible === true &&
    card?.videoId &&
    typeof card?.timestampMs === "number" &&
    card?.replay?.durationMs === 6000 &&
    Array.isArray(card?.silhouettes) &&
    card?.interpretationText === false,
  );

  return {
    ok,
    reason: ok ? "moment_card_rendering_valid" : "moment_card_rendering_incomplete",
  };
}
