import {
  createChroniclePages
} from "../journal/chroniclePages";

import {
  createLifeChapter
} from "./lifeChapter";

export function runChronicleRuntime() {
  return {
    active: true,
    pages: createChroniclePages(),
    chapter: createLifeChapter()
  };
}
