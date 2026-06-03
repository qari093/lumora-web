export type LumenCoreEvolutionHooks = {
  soulSignatureHooks: boolean;
  whisperArcHooks: boolean;
  soulDialHooks: boolean;
  naviSeedHooks: boolean;
  serendipityPortalHooks: boolean;
  innerWeatherHooks: boolean;
  companionHooks: boolean;
  livingIdentityHooks: boolean;
  activeNow: false;
};

export function getLumenCoreEvolutionHooks(): LumenCoreEvolutionHooks {
  return {
    soulSignatureHooks: true,
    whisperArcHooks: true,
    soulDialHooks: true,
    naviSeedHooks: true,
    serendipityPortalHooks: true,
    innerWeatherHooks: true,
    companionHooks: true,
    livingIdentityHooks: true,
    activeNow: false,
  };
}
