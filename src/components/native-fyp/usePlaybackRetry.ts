"use client";

import { useRef } from "react";

export function usePlaybackRetry(maxRetries = 2) {
  const retries = useRef(0);

  function canRetry() {
    return retries.current < maxRetries;
  }

  function recordRetry() {
    retries.current += 1;
  }

  function resetRetry() {
    retries.current = 0;
  }

  return { canRetry, recordRetry, resetRetry };
}
