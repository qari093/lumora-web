"use client";

import { useEffect, useState } from "react";

export function useNetworkMode() {
  const [mode, setMode] = useState<"wifi" | "cellular" | "data_saver">("wifi");

  useEffect(() => {
    const nav: any = navigator;

    if (nav.connection?.saveData) {
      setMode("data_saver");
      return;
    }

    if (nav.connection?.effectiveType?.includes("2g") || nav.connection?.effectiveType?.includes("3g")) {
      setMode("cellular");
    } else {
      setMode("wifi");
    }
  }, []);

  return mode;
}
