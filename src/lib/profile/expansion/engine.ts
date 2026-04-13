export type TasteExpansion = {
  enabled: boolean;
  expansionWeight: number;
  strategy: "adjacent-interest";
};

export function buildTasteExpansion(): TasteExpansion {
  return {
    enabled: true,
    expansionWeight: 0.18,
    strategy: "adjacent-interest",
  };
}
