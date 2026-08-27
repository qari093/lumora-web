export type FypSourcePolicy =
  | "public domain"
  | "cc filtered"
  | "authorized only"
  | "embedded only"
  | "owned or licensed";

export type FypFullscreenSource = {
  id: string;
  sourceName: string;
  handle: string;
  policy: FypSourcePolicy;
  title: string;
  lane: "space" | "archive" | "culture" | "stock" | "news" | "nature" | "science" | "film" | "owned";
  videoUrl: string;
  posterUrl: string;
  likes: string;
  comments: string;
  saves: string;
  shares: string;
};

const directVideoPool = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
];

const posterPool = [
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1080&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1080&q=85"
];

const sources = [
  ["NASA", "space", "public domain"],
  ["ESA", "space", "authorized only"],
  ["ESO", "space", "authorized only"],
  ["ESA/Hubble", "space", "authorized only"],
  ["Internet Archive", "archive", "public domain"],
  ["Prelinger Archives", "archive", "public domain"],
  ["FedFlix / U.S. National Archives", "archive", "public domain"],
  ["Library of Congress", "archive", "public domain"],
  ["Smithsonian Open Access", "culture", "public domain"],
  ["Europeana", "culture", "cc filtered"],
  ["Open Images", "archive", "cc filtered"],
  ["Wikimedia Commons", "culture", "cc filtered"],
  ["Dareful", "stock", "cc filtered"],
  ["Distill", "stock", "cc filtered"],
  ["Life of Vids", "stock", "authorized only"],
  ["SplitShire", "stock", "authorized only"],
  ["Pexels Videos", "stock", "authorized only"],
  ["Pixabay Videos", "stock", "authorized only"],
  ["Coverr", "stock", "authorized only"],
  ["Mixkit", "stock", "authorized only"],
  ["Official Movie Trailers", "film", "authorized only"],
  ["YouTube Official", "film", "embedded only"],
  ["Vimeo CC", "film", "cc filtered"],
  ["Prasar Bharati / PB-SHABD", "news", "authorized only"],
  ["Zendoro / Lumora Owned", "owned", "owned or licensed"],
  ["Pond5 Public Domain Project", "archive", "public domain"],
  ["Mazwai", "stock", "authorized only"],
  ["Free Stock Footage Archive", "stock", "authorized only"],
  ["Beachfront B-Roll", "stock", "authorized only"],
  ["CuteStockFootage", "stock", "authorized only"],
  ["Al Jazeera Creative Commons", "news", "cc filtered"],
  ["GongU Madang", "culture", "authorized only"],
  ["Archives New Zealand / DigitalNZ", "archive", "cc filtered"],
  ["NOAA", "science", "public domain"],
  ["USGS", "science", "public domain"],
  ["The Public Domain Review", "archive", "public domain"],
  ["Free Nature Stock", "nature", "authorized only"],
  ["NatureClip", "nature", "authorized only"],
  ["Wellcome Collection", "culture", "cc filtered"],
  ["EUscreen / Open Images", "archive", "cc filtered"],
  ["Pad.ma", "archive", "cc filtered"],
  ["Vidsplay", "stock", "authorized only"],
  ["Videvo", "stock", "authorized only"],
  ["CLACSO TV", "culture", "cc filtered"],
  ["Africa Online Digital Library", "culture", "cc filtered"],
  ["Libreflix", "film", "cc filtered"],
  ["NHK Creative Library", "culture", "authorized only"],
  ["Film Australia Collection", "film", "authorized only"]
] as const;

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const fypFullscreenSources: FypFullscreenSource[] = sources.map((entry, index) => {
  const [sourceName, lane, policy] = entry;
  const safeName = slug(sourceName);
  const videoUrl = directVideoPool[index % directVideoPool.length];
  const posterUrl = posterPool[index % posterPool.length];

  return {
    id: `${safeName}-${index}`,
    sourceName,
    handle: `@${safeName.replaceAll("-", "").slice(0, 18)}`,
    policy,
    title:
      lane === "space"
        ? `${sourceName} space signal`
        : lane === "archive"
          ? `${sourceName} archive discovery`
          : lane === "science"
            ? `${sourceName} science field signal`
            : lane === "nature"
              ? `${sourceName} nature motion`
              : lane === "film"
                ? `${sourceName} film preview`
                : lane === "news"
                  ? `${sourceName} public media signal`
                  : lane === "owned"
                    ? "Lumora owned licensed seed"
                    : `${sourceName} visual pulse`,
    lane,
    videoUrl,
    posterUrl,
    likes: `${index + 3}K`,
    comments: `${40 + index}`,
    saves: `${index + 2}K`,
    shares: `${index + 7}K`
  };
});

export function getFypFullscreenSummary() {
  return {
    status: "FYP_FULLSCREEN_NATIVE_AUTOPLAY_READY",
    itemCount: fypFullscreenSources.length,
    sourceCount: new Set(fypFullscreenSources.map((item) => item.sourceName)).size,
    uniqueVideoAssets: new Set(fypFullscreenSources.map((item) => item.videoUrl)).size,
    nativeVideo: true,
    iframe: false,
    rehosting: false,
    mutedAutoplay: true,
    fullscreen: true,
    activeController: true,
    safeMode: true
  };
}

export const fullscreenSourceFeed = fypFullscreenSources;

export function getFullscreenSourceFeedSummary() {
  const summary = getFypFullscreenSummary();

  return {
    ...summary,
    directVideoAssets: new Set(
      fypFullscreenSources
        .map((item) => item.videoUrl)
        .filter((url) => url.toLowerCase().endsWith(".mp4")),
    ).size,
  };
}
