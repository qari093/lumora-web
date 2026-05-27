import type { OpenCanonFilm } from "./types";

export const openCanonSeedFilms: OpenCanonFilm[] = [
  {
    id: "open-canon-001",
    title: "Sample Public Domain Classic",
    region: "public-domain",
    sourceUrl: "https://archive.org",
    rightsVerified: true,
    embeddable: true,
    emotionalTags: ["wonder", "nostalgia"],
  },
  {
    id: "open-canon-002",
    title: "Sample Korean Classic",
    region: "korea",
    sourceUrl: "https://youtube.com",
    rightsVerified: true,
    embeddable: true,
    emotionalTags: ["tension", "longing"],
  },
  {
    id: "open-canon-003",
    title: "Sample Punjabi Soul Film",
    region: "punjabi",
    sourceUrl: "https://youtube.com",
    rightsVerified: true,
    embeddable: true,
    emotionalTags: ["warmth", "devotion"],
  },
];

export function validateOpenCanonFilm(film: OpenCanonFilm) {
  return Boolean(
    film.id &&
    film.title &&
    film.sourceUrl &&
    film.rightsVerified &&
    film.emotionalTags.length > 0
  );
}
