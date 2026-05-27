"use client";

import { useEffect, useState } from "react";

let GLOBAL_MUTED = true;

export function useGlobalMute() {
  const [muted, setMuted] = useState(GLOBAL_MUTED);

  function toggle() {
    GLOBAL_MUTED = !GLOBAL_MUTED;
    setMuted(GLOBAL_MUTED);
  }

  return { muted, toggle };
}
