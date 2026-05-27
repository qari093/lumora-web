import type {
  LifeChapter
} from "../types";

export function createLifeChapter(): LifeChapter {
  return {
    id: "chapter_001",
    transition: "new_beginning"
  };
}
