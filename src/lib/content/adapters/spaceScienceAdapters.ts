import type { SourceAdapter } from "./adapterTypes";
import { buildAdapterClip } from "./adapterTypes";

export const SPACE_SCIENCE_ADAPTERS: SourceAdapter[] = [
  {
    id: "nasa",
    name: "NASA",
    group: "space-science",
    enabled: true,
    fetch: async () => [
      buildAdapterClip({
        id: "nasa-seed-1",
        title: "NASA Launch Moment",
        source: "NASA",
        license: "public domain",
        sourceUrl: "https://images.nasa.gov",
        playableUrl: "https://example.com/nasa-launch.mp4",
        mimeType: "video/mp4",
        hasAudio: true,
        durationSeconds: 30,
      }),
    ],
  },
  {
    id: "esa",
    name: "ESA",
    group: "space-science",
    enabled: true,
    fetch: async () => [
      buildAdapterClip({
        id: "esa-seed-1",
        title: "ESA Earth Observation",
        source: "ESA",
        license: "CC BY 4.0",
        sourceUrl: "https://esa.int",
        playableUrl: "https://example.com/esa-earth.mp4",
        mimeType: "video/mp4",
        hasAudio: true,
        durationSeconds: 30,
      }),
    ],
  },
  {
    id: "eso",
    name: "ESO",
    group: "space-science",
    enabled: true,
    fetch: async () => [
      buildAdapterClip({
        id: "eso-seed-1",
        title: "ESO Observatory",
        source: "ESO",
        license: "CC BY 4.0",
        sourceUrl: "https://eso.org",
        playableUrl: "https://example.com/eso.mp4",
        mimeType: "video/mp4",
        hasAudio: true,
        durationSeconds: 30,
      }),
    ],
  },
  {
    id: "hubble",
    name: "ESA/Hubble",
    group: "space-science",
    enabled: true,
    fetch: async () => [
      buildAdapterClip({
        id: "hubble-seed-1",
        title: "Hubble Deep Space",
        source: "ESA/Hubble",
        license: "CC BY 4.0",
        sourceUrl: "https://esahubble.org",
        playableUrl: "https://example.com/hubble.mp4",
        mimeType: "video/mp4",
        hasAudio: true,
        durationSeconds: 30,
      }),
    ],
  },
  {
    id: "noaa",
    name: "NOAA",
    group: "space-science",
    enabled: true,
    fetch: async () => [
      buildAdapterClip({
        id: "noaa-seed-1",
        title: "NOAA Ocean Storm",
        source: "NOAA",
        license: "public domain",
        sourceUrl: "https://noaa.gov",
        playableUrl: "https://example.com/noaa.mp4",
        mimeType: "video/mp4",
        hasAudio: true,
        durationSeconds: 30,
      }),
    ],
  },
  {
    id: "usgs",
    name: "USGS",
    group: "space-science",
    enabled: true,
    fetch: async () => [
      buildAdapterClip({
        id: "usgs-seed-1",
        title: "USGS Earth Footage",
        source: "USGS",
        license: "public domain",
        sourceUrl: "https://usgs.gov",
        playableUrl: "https://example.com/usgs.mp4",
        mimeType: "video/mp4",
        hasAudio: true,
        durationSeconds: 30,
      }),
    ],
  },
];
