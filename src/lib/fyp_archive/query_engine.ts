export const ARCHIVE_BASE_QUERIES = [
  "home movie family",
  "kids playing street",
  "crowd public event",
  "people arguing",
  "street scene daily life",
  "festival celebration crowd",
  "wedding ceremony old footage",
  "school children playing",
  "market street people",
  "train station crowd",
];

export const ARCHIVE_RAW_KEYWORDS = [
  "amateur",
  "raw footage",
  "handheld",
  "unfiltered",
  "home video",
];

export const ARCHIVE_DECADES = [
  "1930s",
  "1940s",
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
];

export function buildArchiveQueries() {
  const queries: string[] = [];

  for (const base of ARCHIVE_BASE_QUERIES) {
    for (const raw of ARCHIVE_RAW_KEYWORDS) {
      queries.push(`${base} ${raw}`);
    }
  }

  return queries;
}

export function attachDecadeMetadata(query: string) {
  const decade = ARCHIVE_DECADES[Math.floor(Math.random() * ARCHIVE_DECADES.length)];
  return {
    query,
    decade,
  };
}

export function buildEventQueries() {
  return [
    "crowd cheering event",
    "public gathering crowd",
    "festival dancing people",
    "sports crowd reaction",
    "city celebration crowd",
  ];
}

export function buildFullArchiveQuerySet() {
  const base = buildArchiveQueries();
  const events = buildEventQueries();

  return [...base, ...events].map((q) => attachDecadeMetadata(q));
}
