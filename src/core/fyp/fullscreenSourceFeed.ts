export type FypFullscreenSourceItem = {
  id: string;
  sourceName: string;
  handle: string;
  title: string;
  lane: "space" | "nature" | "archive" | "cinema" | "science" | "culture" | "stock" | "news" | "owned";
  safety: "public_domain" | "cc_filtered" | "authorized_only" | "owned_or_licensed" | "preview_source";
  videoUrl: string;
  posterUrl: string;
  likes: string;
  comments: string;
  saves: string;
  shares: string;
};

const playbackPool = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
];

const posterPool = [
  "https://i.ytimg.com/vi/21X5lGlDOfg/hqdefault.jpg",
  "https://i.ytimg.com/vi/bVQpwxgMQCg/hqdefault.jpg",
  "https://i.ytimg.com/vi/QKxkzN0-0IU/hqdefault.jpg",
  "https://i.ytimg.com/vi/9ZfN87gSjvI/hqdefault.jpg",
  "https://i.ytimg.com/vi/K6qGwmXZtsE/hqdefault.jpg",
  "https://i.ytimg.com/vi/I1fQ-3-CEFg/hqdefault.jpg",
  "https://i.ytimg.com/vi/x2D7jHfitzk/hqdefault.jpg",
  "https://i.ytimg.com/vi/C1U2S3xJZlQ/hqdefault.jpg",
  "https://i.ytimg.com/vi/N5Qk1VgWj4A/hqdefault.jpg",
  "https://i.ytimg.com/vi/O9mYwRlucZY/hqdefault.jpg",
  "https://i.ytimg.com/vi/k3B3rCJgXJY/hqdefault.jpg",
  "https://i.ytimg.com/vi/fTnZ4D7xJ6E/hqdefault.jpg",
  "https://i.ytimg.com/vi/hY7m5jjJ9mM/hqdefault.jpg"
];

const sourceRows = [
  ["NASA", "space", "public_domain", "Space pulse from NASA"],
  ["ESA", "space", "authorized_only", "European space mission signal"],
  ["ESO", "space", "authorized_only", "Observatory sky discovery"],
  ["ESA/Hubble", "space", "authorized_only", "Hubble deep-space moment"],
  ["Internet Archive", "archive", "public_domain", "Archive film discovery"],
  ["Prelinger Archives", "archive", "public_domain", "Historical footage pulse"],
  ["FedFlix / U.S. National Archives", "archive", "public_domain", "Public archive film"],
  ["Library of Congress", "archive", "public_domain", "Moving-image history"],
  ["Smithsonian Open Access", "culture", "public_domain", "Culture and science glimpse"],
  ["Europeana", "culture", "cc_filtered", "European cultural archive"],
  ["Open Images", "archive", "cc_filtered", "Open media archive"],
  ["Wikimedia Commons", "culture", "cc_filtered", "Commons visual knowledge"],
  ["Dareful", "stock", "cc_filtered", "Cinematic stock motion"],
  ["Distill", "stock", "cc_filtered", "Atmospheric stock footage"],
  ["Life of Vids", "stock", "authorized_only", "Motion scene preview"],
  ["SplitShire", "stock", "authorized_only", "Visual motion clip"],
  ["Pexels Videos", "stock", "authorized_only", "Natural video moment"],
  ["Pixabay Videos", "stock", "authorized_only", "Relaxing video motion"],
  ["Coverr", "stock", "authorized_only", "Free stock clip"],
  ["Mixkit", "stock", "authorized_only", "Cinematic video card"],
  ["Official Movie Trailers", "cinema", "authorized_only", "Official trailer preview"],
  ["YouTube", "cinema", "preview_source", "Embed-safe discovery"],
  ["Vimeo", "stock", "cc_filtered", "CC-filtered creative clip"],
  ["Prasar Bharati / PB-SHABD", "news", "authorized_only", "Broadcast archive signal"],
  ["Zendoro / Lumora Owned", "owned", "owned_or_licensed", "Owned licensed seed"],
  ["Pond5 Public Domain Project", "archive", "public_domain", "Public-domain project"],
  ["Mazwai", "stock", "authorized_only", "Cinematic motion"],
  ["Free Stock Footage Archive", "stock", "authorized_only", "Stock footage archive"],
  ["Beachfront B-Roll", "stock", "authorized_only", "B-roll motion card"],
  ["CuteStockFootage", "stock", "authorized_only", "Motion clip card"],
  ["Al Jazeera Creative Commons", "news", "cc_filtered", "Documentary signal"],
  ["GongU Madang", "culture", "authorized_only", "Cultural media card"],
  ["Archives New Zealand / DigitalNZ", "archive", "cc_filtered", "Historical archive card"],
  ["NOAA", "science", "public_domain", "Ocean and weather signal"],
  ["USGS", "science", "public_domain", "Earth science footage"],
  ["The Public Domain Review", "culture", "public_domain", "Visual essay moment"],
  ["Free Nature Stock", "nature", "authorized_only", "Nature scene card"],
  ["NatureClip", "nature", "authorized_only", "Wildlife motion preview"],
  ["Wellcome Collection", "science", "cc_filtered", "Science collection clip"],
  ["EUscreen / Open Images", "archive", "cc_filtered", "European media archive"],
  ["Pad.ma", "archive", "authorized_only", "Archive signal card"],
  ["Vidsplay", "stock", "authorized_only", "Free stock scene"],
  ["Videvo", "stock", "authorized_only", "Stock footage card"],
  ["CLACSO TV", "culture", "cc_filtered", "Cultural learning card"],
  ["Africa Online Digital Library", "culture", "cc_filtered", "African digital archive"],
  ["Libreflix", "cinema", "authorized_only", "Cinema discovery card"],
  ["NHK Creative Library", "culture", "authorized_only", "Creative library card"],
  ["Film Australia Collection", "archive", "authorized_only", "Film archive collection"]
] as const;

export const fullscreenSourceFeed: FypFullscreenSourceItem[] = sourceRows.map((row, index) => {
  const [sourceName, lane, safety, title] = row;

  return {
    id: `${sourceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    sourceName,
    handle: `@${sourceName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18)}`,
    title,
    lane,
    safety,
    videoUrl: playbackPool[index % playbackPool.length]!,
    posterUrl: posterPool[index % posterPool.length]!,
    likes: `${Math.round(1.2 + index * 0.4)}K`,
    comments: String(40 + index),
    saves: `${Math.round(2 + index * 0.3)}K`,
    shares: `${Math.round(7 + index * 1.1)}K`
  };
});

export function getFullscreenSourceFeedSummary() {
  return {
    status: "FYP_FULLSCREEN_NATIVE_AUTOPLAY_READY",
    itemCount: fullscreenSourceFeed.length,
    sourceCount: new Set(fullscreenSourceFeed.map((item) => item.sourceName)).size,
    directVideoAssets: new Set(fullscreenSourceFeed.map((item) => item.videoUrl)).size,
    mode: "muted_native_video_autoplay",
    safeMode: true,
    rehosting: false
  };
}
