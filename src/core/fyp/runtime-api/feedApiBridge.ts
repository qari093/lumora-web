import {
  buildFypFeedBridge,
  type FypFeedBridgeItem
} from "@/src/core/fyp/ingestion/feedBridge";

import type { FypIngestionJobInput } from "@/src/core/fyp/ingestion/ingestionQueue";

export type FypRuntimeTraceLane = "wonder" | "learn" | "laugh" | "build" | "explore";

export type FypRuntimeApiFeedItem = {
  id: string;
  sourceId: string;
  sourceLabel: string;
  title: string;
  creator: string;
  playbackUrl: string;
  deliveryLane: "native_video" | "official_embed";
  licenseName: string;
  attribution: string;
  durationSeconds: number;
  rankingSeed: number;
  safetyTags: string[];
  traceLane: FypRuntimeTraceLane;
};

export type FypRuntimeApiFeedResponse = {
  ok: boolean;
  generatedAt: string;
  count: number;
  items: FypRuntimeApiFeedItem[];
  blocked: number;
  source: "lumora_fyp_ingestion_bridge";
};

export const DEFAULT_RUNTIME_FEED_INPUTS: FypIngestionJobInput[] = [
  {
    sourceId: "NASA",
    externalId: "nasa-runtime-seed-1",
    title: "NASA runtime motion seed",
    creator: "NASA",
    sampleUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 24
  },
  {
    sourceId: "ESA",
    externalId: "esa-runtime-seed-2",
    title: "ESA runtime motion seed",
    creator: "ESA",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 25
  },
  {
    sourceId: "ESO",
    externalId: "eso-runtime-seed-3",
    title: "ESO runtime motion seed",
    creator: "ESO",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 26
  },
  {
    sourceId: "ESA_HUBBLE",
    externalId: "esa-hubble-runtime-seed-4",
    title: "ESA HUBBLE runtime motion seed",
    creator: "ESA HUBBLE",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 27
  },
  {
    sourceId: "INTERNET_ARCHIVE",
    externalId: "internet-archive-runtime-seed-5",
    title: "INTERNET ARCHIVE runtime motion seed",
    creator: "INTERNET ARCHIVE",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 28
  },
  {
    sourceId: "PRELINGER",
    externalId: "prelinger-runtime-seed-6",
    title: "PRELINGER runtime motion seed",
    creator: "PRELINGER",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 29
  },
  {
    sourceId: "FEDFLIX",
    externalId: "fedflix-runtime-seed-7",
    title: "FEDFLIX runtime motion seed",
    creator: "FEDFLIX",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 30
  },
  {
    sourceId: "LIBRARY_OF_CONGRESS",
    externalId: "library-of-congress-runtime-seed-8",
    title: "LIBRARY OF CONGRESS runtime motion seed",
    creator: "LIBRARY OF CONGRESS",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 31
  },
  {
    sourceId: "SMITHSONIAN",
    externalId: "smithsonian-runtime-seed-9",
    title: "SMITHSONIAN runtime motion seed",
    creator: "SMITHSONIAN",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 32
  },
  {
    sourceId: "EUROPEANA",
    externalId: "europeana-runtime-seed-10",
    title: "EUROPEANA runtime motion seed",
    creator: "EUROPEANA",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 33
  },
  {
    sourceId: "OPEN_IMAGES",
    externalId: "open-images-runtime-seed-11",
    title: "OPEN IMAGES runtime motion seed",
    creator: "OPEN IMAGES",
    sampleUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 34
  },
  {
    sourceId: "WIKIMEDIA",
    externalId: "wikimedia-runtime-seed-12",
    title: "WIKIMEDIA runtime motion seed",
    creator: "WIKIMEDIA",
    sampleUrl: "https://www.w3schools.com/html/movie.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    licenseName: "creative_commons",
    licenseUrl: "https://lumora.example/license-proof/wikimedia",
    attribution: "WIKIMEDIA",
    durationSeconds: 35
  },
  {
    sourceId: "DAREFUL",
    externalId: "dareful-runtime-seed-13",
    title: "DAREFUL runtime motion seed",
    creator: "DAREFUL",
    sampleUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 36
  },
  {
    sourceId: "DISTILL",
    externalId: "distill-runtime-seed-14",
    title: "DISTILL runtime motion seed",
    creator: "DISTILL",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 37
  },
  {
    sourceId: "LIFE_OF_VIDS",
    externalId: "life-of-vids-runtime-seed-15",
    title: "LIFE OF VIDS runtime motion seed",
    creator: "LIFE OF VIDS",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 38
  },
  {
    sourceId: "SPLITSHIRE",
    externalId: "splitshire-runtime-seed-16",
    title: "SPLITSHIRE runtime motion seed",
    creator: "SPLITSHIRE",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 39
  },
  {
    sourceId: "PEXELS",
    externalId: "pexels-runtime-seed-17",
    title: "PEXELS runtime motion seed",
    creator: "PEXELS",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 40
  },
  {
    sourceId: "PIXABAY",
    externalId: "pixabay-runtime-seed-18",
    title: "PIXABAY runtime motion seed",
    creator: "PIXABAY",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 41
  },
  {
    sourceId: "COVERR",
    externalId: "coverr-runtime-seed-19",
    title: "COVERR runtime motion seed",
    creator: "COVERR",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 42
  },
  {
    sourceId: "MIXKIT",
    externalId: "mixkit-runtime-seed-20",
    title: "MIXKIT runtime motion seed",
    creator: "MIXKIT",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 43
  },
  {
    sourceId: "OFFICIAL_TRAILERS",
    externalId: "official-trailers-runtime-seed-21",
    title: "OFFICIAL TRAILERS runtime motion seed",
    creator: "OFFICIAL TRAILERS",
    sampleUrl: "https://www.youtube.com/watch?v=official_trailers-runtime-seed",
    licenseName: "official_trailer_embed",
    rightsTag: "authorized_trailer",
    commercialReuseAllowed: true,
    embedOnly: true,
    officialChannel: true,
    durationSeconds: 44
  },
  {
    sourceId: "YOUTUBE_OFFICIAL",
    externalId: "youtube-official-runtime-seed-22",
    title: "YOUTUBE OFFICIAL runtime motion seed",
    creator: "YOUTUBE OFFICIAL",
    sampleUrl: "https://www.youtube.com/watch?v=youtube_official-runtime-seed",
    licenseName: "official_channel_embed",
    rightsTag: "authorized_embed",
    commercialReuseAllowed: true,
    embedOnly: true,
    officialChannel: true,
    durationSeconds: 45
  },
  {
    sourceId: "VIMEO_CC",
    externalId: "vimeo-cc-runtime-seed-23",
    title: "VIMEO CC runtime motion seed",
    creator: "VIMEO CC",
    sampleUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    licenseName: "creative_commons",
    licenseUrl: "https://lumora.example/license-proof/vimeo_cc",
    attribution: "VIMEO_CC",
    durationSeconds: 46
  },
  {
    sourceId: "PRASAR_BHARATI",
    externalId: "prasar-bharati-runtime-seed-24",
    title: "PRASAR BHARATI runtime motion seed",
    creator: "PRASAR BHARATI",
    sampleUrl: "https://www.w3schools.com/html/movie.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 47
  },
  {
    sourceId: "LUMORA_LICENSED",
    externalId: "lumora-licensed-runtime-seed-25",
    title: "LUMORA LICENSED runtime motion seed",
    creator: "LUMORA LICENSED",
    sampleUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 48
  },
  {
    sourceId: "POND5_PUBLIC_DOMAIN",
    externalId: "pond5-public-domain-runtime-seed-26",
    title: "POND5 PUBLIC DOMAIN runtime motion seed",
    creator: "POND5 PUBLIC DOMAIN",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 49
  },
  {
    sourceId: "MAZWAI",
    externalId: "mazwai-runtime-seed-27",
    title: "MAZWAI runtime motion seed",
    creator: "MAZWAI",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 50
  },
  {
    sourceId: "FREE_STOCK_FOOTAGE_ARCHIVE",
    externalId: "free-stock-footage-archive-runtime-seed-28",
    title: "FREE STOCK FOOTAGE ARCHIVE runtime motion seed",
    creator: "FREE STOCK FOOTAGE ARCHIVE",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 51
  },
  {
    sourceId: "BEACHFRONT_BROLL",
    externalId: "beachfront-broll-runtime-seed-29",
    title: "BEACHFRONT BROLL runtime motion seed",
    creator: "BEACHFRONT BROLL",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 52
  },
  {
    sourceId: "CUTESTOCKFOOTAGE",
    externalId: "cutestockfootage-runtime-seed-30",
    title: "CUTESTOCKFOOTAGE runtime motion seed",
    creator: "CUTESTOCKFOOTAGE",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 53
  },
  {
    sourceId: "ALJAZEERA_CC",
    externalId: "aljazeera-cc-runtime-seed-31",
    title: "ALJAZEERA CC runtime motion seed",
    creator: "ALJAZEERA CC",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    licenseName: "creative_commons",
    licenseUrl: "https://lumora.example/license-proof/aljazeera_cc",
    attribution: "ALJAZEERA_CC",
    durationSeconds: 54
  },
  {
    sourceId: "GONGU_MADANG",
    externalId: "gongu-madang-runtime-seed-32",
    title: "GONGU MADANG runtime motion seed",
    creator: "GONGU MADANG",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 55
  },
  {
    sourceId: "DIGITAL_NZ",
    externalId: "digital-nz-runtime-seed-33",
    title: "DIGITAL NZ runtime motion seed",
    creator: "DIGITAL NZ",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 56
  },
  {
    sourceId: "NOAA",
    externalId: "noaa-runtime-seed-34",
    title: "NOAA runtime motion seed",
    creator: "NOAA",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 57
  },
  {
    sourceId: "USGS",
    externalId: "usgs-runtime-seed-35",
    title: "USGS runtime motion seed",
    creator: "USGS",
    sampleUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 58
  },
  {
    sourceId: "PUBLIC_DOMAIN_REVIEW",
    externalId: "public-domain-review-runtime-seed-36",
    title: "PUBLIC DOMAIN REVIEW runtime motion seed",
    creator: "PUBLIC DOMAIN REVIEW",
    sampleUrl: "https://www.w3schools.com/html/movie.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 59
  },
  {
    sourceId: "FREE_NATURE_STOCK",
    externalId: "free-nature-stock-runtime-seed-37",
    title: "FREE NATURE STOCK runtime motion seed",
    creator: "FREE NATURE STOCK",
    sampleUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 24
  },
  {
    sourceId: "NATURECLIP",
    externalId: "natureclip-runtime-seed-38",
    title: "NATURECLIP runtime motion seed",
    creator: "NATURECLIP",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 25
  },
  {
    sourceId: "WELLCOME",
    externalId: "wellcome-runtime-seed-39",
    title: "WELLCOME runtime motion seed",
    creator: "WELLCOME",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 26
  },
  {
    sourceId: "EUSCREEN",
    externalId: "euscreen-runtime-seed-40",
    title: "EUSCREEN runtime motion seed",
    creator: "EUSCREEN",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 27
  },
  {
    sourceId: "PADMA",
    externalId: "padma-runtime-seed-41",
    title: "PADMA runtime motion seed",
    creator: "PADMA",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 28
  },
  {
    sourceId: "VIDSPLAY",
    externalId: "vidsplay-runtime-seed-42",
    title: "VIDSPLAY runtime motion seed",
    creator: "VIDSPLAY",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 29
  },
  {
    sourceId: "VIDEVO",
    externalId: "videvo-runtime-seed-43",
    title: "VIDEVO runtime motion seed",
    creator: "VIDEVO",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 30
  },
  {
    sourceId: "CLACSO_TV",
    externalId: "clacso-tv-runtime-seed-44",
    title: "CLACSO TV runtime motion seed",
    creator: "CLACSO TV",
    sampleUrl: "https://www.youtube.com/watch?v=clacso_tv-runtime-seed",
    licenseName: "authorized_embed",
    rightsTag: "authorized_embed",
    commercialReuseAllowed: true,
    embedOnly: true,
    officialChannel: true,
    durationSeconds: 31
  },
  {
    sourceId: "AFRICA_ONLINE_DIGITAL_LIBRARY",
    externalId: "africa-online-digital-library-runtime-seed-45",
    title: "AFRICA ONLINE DIGITAL LIBRARY runtime motion seed",
    creator: "AFRICA ONLINE DIGITAL LIBRARY",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 32
  },
  {
    sourceId: "LIBREFLIX",
    externalId: "libreflix-runtime-seed-46",
    title: "LIBREFLIX runtime motion seed",
    creator: "LIBREFLIX",
    sampleUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 33
  },
  {
    sourceId: "NHK_CREATIVE_LIBRARY",
    externalId: "nhk-creative-library-runtime-seed-47",
    title: "NHK CREATIVE LIBRARY runtime motion seed",
    creator: "NHK CREATIVE LIBRARY",
    sampleUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 34
  },
  {
    sourceId: "NFSA_FILM_AUSTRALIA",
    externalId: "nfsa-film-australia-runtime-seed-48",
    title: "NFSA FILM AUSTRALIA runtime motion seed",
    creator: "NFSA FILM AUSTRALIA",
    sampleUrl: "https://www.w3schools.com/html/movie.mp4",
    rightsTag: "public_domain",
    commercialReuseAllowed: true,
    embedOnly: false,
    durationSeconds: 35
  }
];



function traceLaneFromItem(item: FypFeedBridgeItem): FypRuntimeTraceLane {
  if (item.sourceId === "NASA" || item.sourceId === "ESA") return "wonder";
  if (item.deliveryLane === "official_embed") return "explore";
  if (item.durationSeconds > 60) return "learn";
  return "build";
}

export function adaptFypBridgeItemToRuntimeApi(item: FypFeedBridgeItem): FypRuntimeApiFeedItem {
  return {
    id: item.id,
    sourceId: item.sourceId,
    sourceLabel: item.sourceLabel,
    title: item.title,
    creator: item.creator,
    playbackUrl: item.url,
    deliveryLane: item.deliveryLane,
    licenseName: item.licenseName,
    attribution: item.attribution,
    durationSeconds: item.durationSeconds,
    rankingSeed: item.rankingSeed,
    safetyTags: item.safetyTags,
    traceLane: traceLaneFromItem(item)
  };
}

export function buildFypRuntimeApiFeed(
  inputs: FypIngestionJobInput[] = DEFAULT_RUNTIME_FEED_INPUTS
): FypRuntimeApiFeedResponse {
  const bridge = buildFypFeedBridge(inputs);
  const items = bridge.items.map(adaptFypBridgeItemToRuntimeApi);

  return {
    ok: true,
    generatedAt: bridge.generatedAt,
    count: items.length,
    items,
    blocked: bridge.blocked.length,
    source: "lumora_fyp_ingestion_bridge"
  };
}

export function validateFypRuntimeApiFeedBridge(): boolean {
  const response = buildFypRuntimeApiFeed();

  return (
    response.ok === true &&
    response.source === "lumora_fyp_ingestion_bridge" &&
    response.count >= 3 &&
    response.items.every((item) =>
      Boolean(item.id) &&
      Boolean(item.playbackUrl) &&
      Boolean(item.title) &&
      Boolean(item.creator) &&
      Boolean(item.licenseName) &&
      item.safetyTags.includes("rights_verified") &&
      ["native_video", "official_embed"].includes(item.deliveryLane) &&
      ["wonder", "learn", "laugh", "build", "explore"].includes(item.traceLane)
    )
  );
}
