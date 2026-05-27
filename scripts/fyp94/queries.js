export const QUERIES = [
  "parkour",
  "surfing",
  "football match",
  "basketball game",
  "city street",
  "cars driving",
  "gym workout",
  "nature waterfall"
];

export function roundRobin(index) {
  return QUERIES[index % QUERIES.length];
}
