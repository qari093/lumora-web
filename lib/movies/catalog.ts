export type MovieItem = {
  id: string;
  title: string;
  year: number;
  lang: string;
  genre: string;
  runtimeMin: number;
  rating: "U" | "PG" | "PG-13" | "R";
  posterEmoji: string;
  synopsis: string;
};

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export function buildSeedMovies(count = 100): MovieItem[] {
  const base: Omit<MovieItem, "id" | "title">[] = [
    { year: 2019, lang: "EN", genre: "Sci-Fi", runtimeMin: 104, rating: "PG-13", posterEmoji: "🌌", synopsis: "A quiet anomaly bends a city’s night sky." },
    { year: 2020, lang: "HI", genre: "Drama", runtimeMin: 118, rating: "PG", posterEmoji: "🎞️", synopsis: "A family archive unlocks a forgotten promise." },
    { year: 2021, lang: "PA", genre: "Comedy", runtimeMin: 96, rating: "PG", posterEmoji: "🪩", synopsis: "A wedding DJ improvises through chaos." },
    { year: 2022, lang: "EN", genre: "Thriller", runtimeMin: 110, rating: "PG-13", posterEmoji: "🗝️", synopsis: "A harmless key reveals an impossible map." },
    { year: 2023, lang: "HI", genre: "Action", runtimeMin: 112, rating: "PG-13", posterEmoji: "⚔️", synopsis: "Two rivals protect the same secret city." },
    { year: 2018, lang: "EN", genre: "Mystery", runtimeMin: 101, rating: "PG", posterEmoji: "🕯️", synopsis: "Clues hide in plain sight, but time is loud." },
    { year: 2024, lang: "HI", genre: "Romance", runtimeMin: 109, rating: "PG", posterEmoji: "��", synopsis: "A train delay turns into a life detour." },
    { year: 2017, lang: "PA", genre: "Music", runtimeMin: 98, rating: "PG", posterEmoji: "��", synopsis: "A street singer finds a studio with rules." },
  ];

  const out: MovieItem[] = [];
  for (let i = 1; i <= count; i++) {
    const b = base[(i - 1) % base.length];
    const id = `mv_${pad3(i)}`;
    const title = `Lumora CineSeed ${pad3(i)}`;
    out.push({ id, title, ...b });
  }
  return out;
}

export const SEED_MOVIES = buildSeedMovies(100);

export function getMovieById(id: string): MovieItem | null {
  return SEED_MOVIES.find((m) => m.id === id) || null;
}
