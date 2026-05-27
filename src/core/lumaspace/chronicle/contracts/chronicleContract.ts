import type {
  ChroniclePage,
  LifeChapter,
  ChronicleRuntimeState
} from "../types";

export function validateChroniclePage(
  page: ChroniclePage
): boolean {
  return Boolean(
    page.id &&
    page.title &&
    page.atmosphere
  );
}

export function validateLifeChapter(
  chapter: LifeChapter
): boolean {
  return Boolean(
    chapter.id &&
    chapter.transition
  );
}

export function validateChronicleRuntime(
  runtime: ChronicleRuntimeState
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.pages.length > 0
  );
}
