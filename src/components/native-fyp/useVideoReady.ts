"use client";

import { useEffect, useState } from "react";

export function useVideoReady() {
  const [ready, setReady] = useState(false);

  function onLoadedData() {
    setReady(true);
  }

  return { ready, onLoadedData };
}
