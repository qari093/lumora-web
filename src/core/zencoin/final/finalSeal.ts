export const civilizationSeal = {
  creatorEconomy: true,
  crossPortalEconomy: true,
  marketplace: true,
  treasury: true,
  cardLayer: true,
  fraudAi: true,
  orchestration: true,
  civilizationReady: true
};

export function civilizationSealHealthy(): boolean {
  return Object.values(civilizationSeal).every(Boolean);
}
