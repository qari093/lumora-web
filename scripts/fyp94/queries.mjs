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

export function roundRobinQuery(index) {
  return QUERIES[index % QUERIES.length];
}
