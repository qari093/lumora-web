export type LumoraFeedSource =
  | "NASA" | "ESA" | "ESO" | "ESA/Hubble" | "Internet Archive" | "Prelinger Archives"
  | "FedFlix / U.S. National Archives" | "Library of Congress" | "Smithsonian Open Access"
  | "Europeana" | "Open Images" | "Wikimedia Commons" | "Dareful" | "Distill"
  | "Life of Vids" | "SplitShire" | "Pexels Videos" | "Pixabay Videos" | "Coverr"
  | "Mixkit" | "Official Movie Trailers" | "YouTube" | "Vimeo" | "Prasar Bharati / PB-SHABD"
  | "Zendoro / Lumora Owned" | "Pond5 Public Domain Project" | "Mazwai"
  | "Free Stock Footage Archive" | "Beachfront B-Roll" | "CuteStockFootage"
  | "Al Jazeera Creative Commons" | "GongU Madang" | "Archives New Zealand / DigitalNZ"
  | "NOAA" | "USGS" | "The Public Domain Review" | "Free Nature Stock" | "NatureClip"
  | "Wellcome Collection" | "EUscreen / Open Images" | "Pad.ma" | "Vidsplay" | "Videvo"
  | "CLACSO TV" | "Africa Online Digital Library" | "Libreflix" | "NHK Creative Library"
  | "Film Australia Collection";

export type LumoraYoutubeFeedItem = {
  id: string;
  title: string;
  channelTitle: string;
  channelHandle: string;
  avatarUrl: string;
  thumbnailUrl: string;
  youtubeWatchUrl: string;
  youtubeEmbedUrl: string;
  duration: string;
  publishedAt: string;
  views: string;
  comments: string;
  reposts: string;
  likes: string;
  sourceLabel: LumoraFeedSource;
  safetyLabel: "embedded_only" | "public_domain" | "cc_filtered" | "owned_or_licensed" | "authorized_only";
  retentionLane: "space" | "nature" | "history" | "culture" | "science" | "cinema" | "news" | "stock" | "archive" | "owned";
};

export function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

const safeThumbs = [
  "jNQXAC9IVRw",
  "aqz-KE-bpKQ",
  "YE7VzlLtp-4"
];

const sources: Array<{
  sourceLabel: LumoraFeedSource;
  lane: LumoraYoutubeFeedItem["retentionLane"];
  safety: LumoraYoutubeFeedItem["safetyLabel"];
}> = [
  { sourceLabel: "NASA", lane: "space", safety: "public_domain" },
  { sourceLabel: "ESA", lane: "space", safety: "authorized_only" },
  { sourceLabel: "ESO", lane: "space", safety: "authorized_only" },
  { sourceLabel: "ESA/Hubble", lane: "space", safety: "authorized_only" },
  { sourceLabel: "Internet Archive", lane: "archive", safety: "public_domain" },
  { sourceLabel: "Prelinger Archives", lane: "history", safety: "public_domain" },
  { sourceLabel: "FedFlix / U.S. National Archives", lane: "history", safety: "public_domain" },
  { sourceLabel: "Library of Congress", lane: "history", safety: "public_domain" },
  { sourceLabel: "Smithsonian Open Access", lane: "culture", safety: "public_domain" },
  { sourceLabel: "Europeana", lane: "culture", safety: "cc_filtered" },
  { sourceLabel: "Open Images", lane: "archive", safety: "cc_filtered" },
  { sourceLabel: "Wikimedia Commons", lane: "culture", safety: "cc_filtered" },
  { sourceLabel: "Dareful", lane: "stock", safety: "cc_filtered" },
  { sourceLabel: "Distill", lane: "stock", safety: "cc_filtered" },
  { sourceLabel: "Life of Vids", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "SplitShire", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Pexels Videos", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Pixabay Videos", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Coverr", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Mixkit", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Official Movie Trailers", lane: "cinema", safety: "authorized_only" },
  { sourceLabel: "YouTube", lane: "cinema", safety: "embedded_only" },
  { sourceLabel: "Vimeo", lane: "stock", safety: "cc_filtered" },
  { sourceLabel: "Prasar Bharati / PB-SHABD", lane: "news", safety: "authorized_only" },
  { sourceLabel: "Zendoro / Lumora Owned", lane: "owned", safety: "owned_or_licensed" },
  { sourceLabel: "Pond5 Public Domain Project", lane: "archive", safety: "public_domain" },
  { sourceLabel: "Mazwai", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Free Stock Footage Archive", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Beachfront B-Roll", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "CuteStockFootage", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Al Jazeera Creative Commons", lane: "news", safety: "cc_filtered" },
  { sourceLabel: "GongU Madang", lane: "culture", safety: "authorized_only" },
  { sourceLabel: "Archives New Zealand / DigitalNZ", lane: "history", safety: "cc_filtered" },
  { sourceLabel: "NOAA", lane: "science", safety: "public_domain" },
  { sourceLabel: "USGS", lane: "science", safety: "public_domain" },
  { sourceLabel: "The Public Domain Review", lane: "culture", safety: "public_domain" },
  { sourceLabel: "Free Nature Stock", lane: "nature", safety: "authorized_only" },
  { sourceLabel: "NatureClip", lane: "nature", safety: "authorized_only" },
  { sourceLabel: "Wellcome Collection", lane: "science", safety: "cc_filtered" },
  { sourceLabel: "EUscreen / Open Images", lane: "archive", safety: "cc_filtered" },
  { sourceLabel: "Pad.ma", lane: "archive", safety: "authorized_only" },
  { sourceLabel: "Vidsplay", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "Videvo", lane: "stock", safety: "authorized_only" },
  { sourceLabel: "CLACSO TV", lane: "culture", safety: "cc_filtered" },
  { sourceLabel: "Africa Online Digital Library", lane: "culture", safety: "cc_filtered" },
  { sourceLabel: "Libreflix", lane: "cinema", safety: "authorized_only" },
  { sourceLabel: "NHK Creative Library", lane: "culture", safety: "authorized_only" },
  { sourceLabel: "Film Australia Collection", lane: "archive", safety: "authorized_only" }
];

export const fypYoutubeVideos: LumoraYoutubeFeedItem[] = sources.map((source, index) => {
  const videoId = safeThumbs[index % safeThumbs.length]!;
  const laneTitle = source.lane.charAt(0).toUpperCase() + source.lane.slice(1);

  return {
    id: `${source.sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    title: `${laneTitle} discovery from ${source.sourceLabel}`,
    channelTitle: source.sourceLabel,
    channelHandle: `@${source.sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18)}`,
    avatarUrl: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    thumbnailUrl: youtubeThumbnail(videoId),
    youtubeWatchUrl: youtubeWatchUrl(videoId),
    youtubeEmbedUrl: youtubeEmbedUrl(videoId),
    duration: ["0:19", "9:56", "10:34", "3:42", "12:08", "5:17"][index % 6]!,
    publishedAt: `${source.safety.replaceAll("_", " ")}`,
    views: `${12 + index}K`,
    comments: String(40 + index),
    reposts: String(90 + index * 3),
    likes: `${(1.2 + index / 10).toFixed(1)}K`,
    sourceLabel: source.sourceLabel,
    safetyLabel: source.safety,
    retentionLane: source.lane
  };
});

export function getFypYoutubeFeedSummary() {
  return {
    status: "FYP_48_SOURCE_RETENTION_FEED_READY",
    source: "multi_source_safe_video_cards",
    itemCount: fypYoutubeVideos.length,
    sourceCount: sources.length,
    rehosting: false,
    embeddedOnly: true,
    safeMode: true,
    allowedPolicy: [
      "public_domain",
      "cc_filtered",
      "owned_or_licensed",
      "authorized_only",
      "embedded_only"
    ]
  };
}
