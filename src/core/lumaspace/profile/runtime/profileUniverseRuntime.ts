import {
  createHeroSpark
} from "../render/heroRenderer";

import {
  createTimelineWaves
} from "../render/timelineWave";

export function runProfileUniverseRuntime() {
  return {
    active: true,
    hero: createHeroSpark(),
    waves: createTimelineWaves()
  };
}
