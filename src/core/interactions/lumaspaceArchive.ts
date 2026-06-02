export type LumaSpaceInteractionArchive = {
  resonanceHistory: boolean;
  reflectionJournal: boolean;
  rippleActivity: boolean;
  echoStream: boolean;
  growthCompass: boolean;
};

export function getLumaSpaceInteractionArchive(): LumaSpaceInteractionArchive {
  return {
    resonanceHistory: true,
    reflectionJournal: true,
    rippleActivity: true,
    echoStream: true,
    growthCompass: true,
  };
}
