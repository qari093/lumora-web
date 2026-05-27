export function oracleSuggest(input: string) {
  const normalized = input.trim().toLowerCase();

  return {
    query: normalized,
    phrase: "A quiet ache under distant rain.",
    films: ["Ugetsu", "Pather Panchali", "The Housemaid"],
    basedOnCommunityGenome: true,
  };
}

export function validateOracleTone(output: string) {
  const banned = ["therapy", "diagnose", "healing", "i understand you"];
  const normalized = output.toLowerCase();

  return banned.every((term) => !normalized.includes(term));
}
