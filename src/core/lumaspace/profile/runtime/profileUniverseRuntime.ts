import { createHeroRenderer } from "../render/heroRenderer";

import {
  createTimelineWave
} from "../render/timelineWave";

export function runProfileUniverseRuntime() {
  return {
    active: true,
    hero: createHeroRenderer(),
    waves: createTimelineWave()
  };
}
