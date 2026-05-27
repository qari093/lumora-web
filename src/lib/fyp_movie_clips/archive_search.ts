export type ArchiveMovieSearchQuery = {
  query: string;
  sourceId: "internet-archive-public-domain" | "prelinger-archives";
  license: "public domain";
  mediaType: "movies";
  minYear?: number;
  maxYear?: number;
};

export const ARCHIVE_MOVIE_QUERIES: ArchiveMovieSearchQuery[] = [
  { query: "public domain movie drama dialogue", sourceId: "internet-archive-public-domain", license: "public domain", mediaType: "movies", maxYear: 1964 },
  { query: "public domain comedy scene talking", sourceId: "internet-archive-public-domain", license: "public domain", mediaType: "movies", maxYear: 1964 },
  { query: "prelinger crowd street sound", sourceId: "prelinger-archives", license: "public domain", mediaType: "movies", maxYear: 1975 },
  { query: "public domain trailer voice", sourceId: "internet-archive-public-domain", license: "public domain", mediaType: "movies", maxYear: 1964 },
];

export function buildArchiveAdvancedSearchUrl(input: ArchiveMovieSearchQuery, page = 1): string {
  const q = [
    `mediatype:${input.mediaType}`,
    input.query,
    input.maxYear ? `year:[0000 TO ${input.maxYear}]` : "",
  ].filter(Boolean).join(" AND ");

  const params = new URLSearchParams({
    q,
    fl: "identifier,title,year,licenseurl,description",
    rows: "25",
    page: String(page),
    output: "json",
  });

  return `https://archive.org/advancedsearch.php?${params.toString()}`;
}

export function buildArchiveMetadataUrl(identifier: string): string {
  return `https://archive.org/metadata/${encodeURIComponent(identifier)}`;
}
