export const livingHubLayout = {
  centralCanvas: {
    widthPercent: 60,
    role: "civilization_sky",
  },
  personalHalo: {
    widthPercent: 20,
    role: "identity_memory",
  },
  socialOrbit: {
    widthPercent: 20,
    role: "presence_squad",
  },
} as const;

export function hubLayoutBalanced(): boolean {
  const total =
    livingHubLayout.centralCanvas.widthPercent +
    livingHubLayout.personalHalo.widthPercent +
    livingHubLayout.socialOrbit.widthPercent;

  return total === 100;
}
