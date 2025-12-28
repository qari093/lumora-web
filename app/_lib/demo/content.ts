export type DemoVideo = {
  id: string;
  title: string;
  desc: string;
  srcMp4?: string; // optional external mp4
};

export type DemoGame = {
  slug: string;
  title: string;
  desc: string;
  route: string;
};

export type DemoMovie = {
  id: string;
  title: string;
  desc: string;
};

export type DemoCelebration = {
  slug: string;
  title: string;
  window: string;
  status: "LIVE" | "UPCOMING" | "ENDED";
};

export type DemoContent = {
  videos: DemoVideo[];
  games: DemoGame[];
  movies: DemoMovie[];
  celebrations: DemoCelebration[];
};

const DEFAULT: DemoContent = {
  videos: [
    { id: "demo-1", title: "Neon Drift — Demo Clip", desc: "Playable demo video tile (watch page)" },
    { id: "demo-2", title: "Sky Pulse — Demo Clip", desc: "Second demo tile (watch page)" },
  ],
  games: [
    { slug: "neon-runner", title: "Neon Runner", desc: "Tap to open the game page", route: "/gmar/games/neon-runner" },
    { slug: "astro-shooter", title: "Astro Shooter", desc: "Tap to open the game page", route: "/gmar/games/astro-shooter" },
    { slug: "hyper-flappy", title: "Hyper Flappy", desc: "Tap to open the game page", route: "/gmar/games/hyper-flappy" },
  ],
  movies: [
    { id: "m-1", title: "Lumora CineVerse — Demo Movie", desc: "A placeholder movie entry (watch page)" },
    { id: "m-2", title: "Night Signal — Demo Movie", desc: "A second placeholder movie entry" },
  ],
  celebrations: [
    { slug: "winter-glow", title: "Winter Glow", window: "48h window", status: "LIVE" },
    { slug: "new-year-ignite", title: "New Year Ignite", window: "72h window", status: "UPCOMING" },
  ],
};

export function getDemoContent(): DemoContent {
  return DEFAULT;
}

export function getDemoCelebrations(): DemoCelebration[] {
  return DEFAULT.celebrations;
}

export function findDemoVideo(id: string): DemoVideo | undefined {
  return DEFAULT.videos.find((v) => v.id === id);
}

export function findDemoMovie(id: string): DemoMovie | undefined {
  return DEFAULT.movies.find((m) => m.id === id);
}

export function findDemoGame(slug: string): DemoGame | undefined {
  return DEFAULT.games.find((g) => g.slug === slug);
}
