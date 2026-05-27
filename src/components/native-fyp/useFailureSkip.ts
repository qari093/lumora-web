"use client";

export function handleVideoError(
  index: number,
  length: number,
  setIndex: (fn: (i: number) => number) => void
) {
  if (index < length - 1) {
    setIndex(i => i + 1);
  }
}
