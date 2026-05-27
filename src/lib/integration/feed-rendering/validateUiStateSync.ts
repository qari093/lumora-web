export function validateFeedUiStateSync(input: any) {
  return {
    ok: Boolean(input.creatorAware && input.witnessLayer?.enabled && input.vanityMetricsHidden),
    creatorAware: Boolean(input.creatorAware),
    witnessAware: Boolean(input.witnessLayer?.enabled),
    vanitySafe: Boolean(input.vanityMetricsHidden),
  };
}
