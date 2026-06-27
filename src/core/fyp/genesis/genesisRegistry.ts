export type GenesisLane = "wonder" | "reflect" | "build" | "learn" | "laugh" | "connect";

export type GenesisTrace = {
  id: string;
  title: string;
  lane: GenesisLane;
  poster: string;
  video: string;
  attribution: string;
  priority: "VERY_HIGH";
  protected: true;
  retirable: false;
  license: "owned_or_verified";
  aspectRatio: "9:16";
};

export const GENESIS_TRACES: GenesisTrace[] = [
  { id: "trace_01_wonder", title: "Nebula", lane: "wonder", poster: "/genesis/posters/trace01.jpg", video: "/genesis/videos/trace01.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_02_reflect", title: "Earth Timelapse", lane: "reflect", poster: "/genesis/posters/trace02.jpg", video: "/genesis/videos/trace02.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_03_build", title: "City Evolution", lane: "build", poster: "/genesis/posters/trace03.jpg", video: "/genesis/videos/trace03.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_04_learn", title: "Space Lecture", lane: "learn", poster: "/genesis/posters/trace04.jpg", video: "/genesis/videos/trace04.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_05_laugh", title: "Funny Animal", lane: "laugh", poster: "/genesis/posters/trace05.jpg", video: "/genesis/videos/trace05.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_06_connect", title: "Nature Documentary", lane: "connect", poster: "/genesis/posters/trace06.jpg", video: "/genesis/videos/trace06.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_07_wonder", title: "Abstract Universe", lane: "wonder", poster: "/genesis/posters/trace07.jpg", video: "/genesis/videos/trace07.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_08_reflect", title: "Historical Archive", lane: "reflect", poster: "/genesis/posters/trace08.jpg", video: "/genesis/videos/trace08.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_09_build", title: "Cinematic Ambition", lane: "build", poster: "/genesis/posters/trace09.jpg", video: "/genesis/videos/trace09.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" },
  { id: "trace_10_connect", title: "Water Meditation", lane: "connect", poster: "/genesis/posters/trace10.jpg", video: "/genesis/videos/trace10.mp4", attribution: "Lumora Genesis Collection", priority: "VERY_HIGH", protected: true, retirable: false, license: "owned_or_verified", aspectRatio: "9:16" }
];

export function validateGenesisRegistry() {
  const ids = new Set(GENESIS_TRACES.map(trace => trace.id));

  return {
    ok:
      GENESIS_TRACES.length === 10 &&
      ids.size === 10 &&
      GENESIS_TRACES.every(trace => trace.protected === true) &&
      GENESIS_TRACES.every(trace => trace.priority === "VERY_HIGH") &&
      GENESIS_TRACES.every(trace => trace.retirable === false) &&
      GENESIS_TRACES.every(trace => trace.license === "owned_or_verified") &&
      GENESIS_TRACES.every(trace => trace.aspectRatio === "9:16") &&
      GENESIS_TRACES.every(trace => trace.video.endsWith(".mp4")) &&
      GENESIS_TRACES.every(trace => trace.poster.endsWith(".jpg")),
    total: GENESIS_TRACES.length,
    uniqueIds: ids.size
  };
}
