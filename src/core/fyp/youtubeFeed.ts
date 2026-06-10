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
  sourceLabel: "YouTube";
  safetyLabel: "embedded_only";
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

export const fypYoutubeVideos: LumoraYoutubeFeedItem[] = [
  {
    id: "jNQXAC9IVRw",
    title: "Founder Review Seed · YouTube Card Layout",
    channelTitle: "Lumora Discovery",
    channelHandle: "@lumora",
    avatarUrl: "https://i.ytimg.com/vi/jNQXAC9IVRw/default.jpg",
    thumbnailUrl: youtubeThumbnail("jNQXAC9IVRw"),
    youtubeWatchUrl: youtubeWatchUrl("jNQXAC9IVRw"),
    youtubeEmbedUrl: youtubeEmbedUrl("jNQXAC9IVRw"),
    duration: "0:19",
    publishedAt: "Founder seed",
    views: "12K",
    comments: "89",
    reposts: "275",
    likes: "5.7K",
    sourceLabel: "YouTube",
    safetyLabel: "embedded_only"
  },
  {
    id: "aqz-KE-bpKQ",
    title: "Calm Creative Video · Founder Feed Test",
    channelTitle: "Lumora Studio",
    channelHandle: "@lumorastudio",
    avatarUrl: "https://i.ytimg.com/vi/aqz-KE-bpKQ/default.jpg",
    thumbnailUrl: youtubeThumbnail("aqz-KE-bpKQ"),
    youtubeWatchUrl: youtubeWatchUrl("aqz-KE-bpKQ"),
    youtubeEmbedUrl: youtubeEmbedUrl("aqz-KE-bpKQ"),
    duration: "9:56",
    publishedAt: "Safe preview",
    views: "24K",
    comments: "41",
    reposts: "118",
    likes: "2.4K",
    sourceLabel: "YouTube",
    safetyLabel: "embedded_only"
  },
  {
    id: "YE7VzlLtp-4",
    title: "CineVerse Preview · YouTube Feed Card",
    channelTitle: "Lumora CineVerse",
    channelHandle: "@cineverse",
    avatarUrl: "https://i.ytimg.com/vi/YE7VzlLtp-4/default.jpg",
    thumbnailUrl: youtubeThumbnail("YE7VzlLtp-4"),
    youtubeWatchUrl: youtubeWatchUrl("YE7VzlLtp-4"),
    youtubeEmbedUrl: youtubeEmbedUrl("YE7VzlLtp-4"),
    duration: "10:34",
    publishedAt: "Preview mode",
    views: "31K",
    comments: "62",
    reposts: "144",
    likes: "3.2K",
    sourceLabel: "YouTube",
    safetyLabel: "embedded_only"
  }
];

export function getFypYoutubeFeedSummary() {
  return {
    status: "FYP_YOUTUBE_STYLE_FEED_READY",
    source: "youtube_embed_cards",
    itemCount: fypYoutubeVideos.length,
    rehosting: false,
    embeddedOnly: true,
    safeMode: true
  };
}
