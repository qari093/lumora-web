export type CrossLanguageTrendInput = {
  entityId: string;
  canonicalLabel: string;
  aliases: Array<{
    language: string;
    label: string;
  }>;
  detectedAt: string;
};

export type CrossLanguageTrendMap = {
  entityId: string;
  canonicalLabel: string;
  aliasMap: Record<string, string[]>;
  detectedAt: string;
};

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

export function buildCrossLanguageTrendMap(
  input: CrossLanguageTrendInput
): CrossLanguageTrendMap {
  const aliasMap: Record<string, string[]> = {};

  for (const alias of input.aliases) {
    const lang = alias.language.trim().toLowerCase();
    if (!aliasMap[lang]) aliasMap[lang] = [];
    const normalized = normalizeLabel(alias.label);
    if (!aliasMap[lang].includes(normalized)) {
      aliasMap[lang].push(normalized);
    }
  }

  return {
    entityId: input.entityId,
    canonicalLabel: input.canonicalLabel.trim(),
    aliasMap,
    detectedAt: input.detectedAt,
  };
}

export function findCrossLanguageTrendAlias(
  map: CrossLanguageTrendMap,
  language: string
): string[] {
  return map.aliasMap[language.trim().toLowerCase()] ?? [];
}
