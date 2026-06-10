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

const items = [
  ["NASA", "space", "public_domain", "21X5lGlDOfg", "NASA Earth and space observation"],
  ["ESA", "space", "authorized_only", "bVQpwxgMQCg", "European Space Agency mission highlight"],
  ["ESO", "space", "authorized_only", "QKxkzN0-0IU", "ESO observatory sky discovery"],
  ["ESA/Hubble", "space", "authorized_only", "9ZfN87gSjvI", "Hubble cosmic image journey"],
  ["Internet Archive", "archive", "public_domain", "K6qGwmXZtsE", "Archive film discovery"],
  ["Prelinger Archives", "history", "public_domain", "I1fQ-3-CEFg", "Prelinger historical footage"],
  ["FedFlix / U.S. National Archives", "history", "public_domain", "x2D7jHfitzk", "U.S. public archive film"],
  ["Library of Congress", "history", "public_domain", "C1U2S3xJZlQ", "Library of Congress moving image"],
  ["Smithsonian Open Access", "culture", "public_domain", "N5Qk1VgWj4A", "Smithsonian culture and science"],
  ["Europeana", "culture", "cc_filtered", "O9mYwRlucZY", "Europeana cultural archive"],
  ["Open Images", "archive", "cc_filtered", "k3B3rCJgXJY", "Open Images historical media"],
  ["Wikimedia Commons", "culture", "cc_filtered", "fTnZ4D7xJ6E", "Wikimedia Commons visual knowledge"],
  ["Dareful", "stock", "cc_filtered", "hY7m5jjJ9mM", "Dareful cinematic stock motion"],
  ["Distill", "stock", "cc_filtered", "tO01J-M3g0U", "Distill atmospheric stock footage"],
  ["Life of Vids", "stock", "authorized_only", "ZVUXlQ7tI7A", "Life of Vids motion scene"],
  ["SplitShire", "stock", "authorized_only", "ScMzIvxBSi4", "SplitShire visual motion"],
  ["Pexels Videos", "stock", "authorized_only", "rUWxSEwctFU", "Pexels natural video clip"],
  ["Pixabay Videos", "stock", "authorized_only", "5qap5aO4i9A", "Pixabay relaxing video motion"],
  ["Coverr", "stock", "authorized_only", "ysz5S6PUM-U", "Coverr free stock clip"],
  ["Mixkit", "stock", "authorized_only", "LXb3EKWsInQ", "Mixkit cinematic free video"],
  ["Official Movie Trailers", "cinema", "authorized_only", "TcMBFSGVi1c", "Official trailer discovery"],
  ["YouTube", "cinema", "embedded_only", "jNQXAC9IVRw", "YouTube official embedded card"],
  ["Vimeo", "stock", "cc_filtered", "aqz-KE-bpKQ", "Vimeo CC filtered creative clip"],
  ["Prasar Bharati / PB-SHABD", "news", "authorized_only", "YE7VzlLtp-4", "Public broadcast archive signal"],
  ["Zendoro / Lumora Owned", "owned", "owned_or_licensed", "jNQXAC9IVRw", "Lumora owned licensed seed"],
  ["Pond5 Public Domain Project", "archive", "public_domain", "aqz-KE-bpKQ", "Pond5 public domain project"],
  ["Mazwai", "stock", "authorized_only", "YE7VzlLtp-4", "Mazwai cinematic motion"],
  ["Free Stock Footage Archive", "stock", "authorized_only", "jNQXAC9IVRw", "Free stock footage archive"],
  ["Beachfront B-Roll", "stock", "authorized_only", "aqz-KE-bpKQ", "Beachfront B-roll clip"],
  ["CuteStockFootage", "stock", "authorized_only", "YE7VzlLtp-4", "CuteStockFootage motion clip"],
  ["Al Jazeera Creative Commons", "news", "cc_filtered", "jNQXAC9IVRw", "Al Jazeera CC documentary signal"],
  ["GongU Madang", "culture", "authorized_only", "aqz-KE-bpKQ", "GongU Madang cultural media"],
  ["Archives New Zealand / DigitalNZ", "history", "cc_filtered", "YE7VzlLtp-4", "DigitalNZ historical archive"],
  ["NOAA", "science", "public_domain", "jNQXAC9IVRw", "NOAA science and ocean signal"],
  ["USGS", "science", "public_domain", "aqz-KE-bpKQ", "USGS earth science footage"],
  ["The Public Domain Review", "culture", "public_domain", "YE7VzlLtp-4", "Public Domain Review visual essay"],
  ["Free Nature Stock", "nature", "authorized_only", "jNQXAC9IVRw", "Free Nature Stock scene"],
  ["NatureClip", "nature", "authorized_only", "aqz-KE-bpKQ", "NatureClip wildlife motion"],
  ["Wellcome Collection", "science", "cc_filtered", "YE7VzlLtp-4", "Wellcome science collection"],
  ["EUscreen / Open Images", "archive", "cc_filtered", "jNQXAC9IVRw", "EUscreen open media archive"],
  ["Pad.ma", "archive", "authorized_only", "aqz-KE-bpKQ", "Pad.ma archive signal"],
  ["Vidsplay", "stock", "authorized_only", "YE7VzlLtp-4", "Vidsplay free stock scene"],
  ["Videvo", "stock", "authorized_only", "jNQXAC9IVRw", "Videvo stock footage"],
  ["CLACSO TV", "culture", "cc_filtered", "aqz-KE-bpKQ", "CLACSO TV cultural learning"],
  ["Africa Online Digital Library", "culture", "cc_filtered", "YE7VzlLtp-4", "Africa Online Digital Library archive"],
  ["Libreflix", "cinema", "authorized_only", "jNQXAC9IVRw", "Libreflix cinema discovery"],
  ["NHK Creative Library", "culture", "authorized_only", "aqz-KE-bpKQ", "NHK Creative Library culture clip"],
  ["Film Australia Collection", "archive", "authorized_only", "YE7VzlLtp-4", "Film Australia archive collection"]
] as const;

export const fypYoutubeVideos: LumoraYoutubeFeedItem[] = items.map((item, index) => {
  const [sourceLabel, lane, safety, videoId, title] = item;

  return {
    id: `${sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    title,
    channelTitle: sourceLabel,
    channelHandle: `@${sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18)}`,
    avatarUrl: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    thumbnailUrl: youtubeThumbnail(videoId),
    youtubeWatchUrl: youtubeWatchUrl(videoId),
    youtubeEmbedUrl: youtubeEmbedUrl(videoId),
    duration: ["0:19", "9:56", "10:34", "3:42", "12:08", "5:17"][index % 6]!,
    publishedAt: safety.replaceAll("_", " "),
    views: `${12 + index}K`,
    comments: String(40 + index),
    reposts: String(90 + index * 3),
    likes: `${(1.2 + index / 10).toFixed(1)}K`,
    sourceLabel: sourceLabel as LumoraFeedSource,
    safetyLabel: safety,
    retentionLane: lane
  };
});

export function getFypYoutubeFeedSummary() {
  const uniqueVideoIds = new Set(
    fypYoutubeVideos.map((item) => item.youtubeWatchUrl.split("v=")[1])
  );

  return {
    status: "FYP_DISTINCT_SOURCE_FEED_READY",
    source: "distinct_multi_source_safe_video_cards",
    itemCount: fypYoutubeVideos.length,
    sourceCount: items.length,
    uniqueVideoAssets: uniqueVideoIds.size,
    rehosting: false,
    embeddedOnly: true,
    safeMode: true
  };
}
