export function validateMonetizationUx(input: {
  forcedAds: boolean;
  hiddenSubliminal: boolean;
  notNowEnabled: boolean;
  disclosureVisible: boolean;
  redStateBlocksAds: boolean;
}) {
  return {
    ok:
      input.forcedAds === false &&
      input.hiddenSubliminal === false &&
      input.notNowEnabled === true &&
      input.disclosureVisible === true &&
      input.redStateBlocksAds === true,
  };
}
