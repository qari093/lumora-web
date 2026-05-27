"use client";

import { useEffect, useState } from "react";

export function useLowPowerMode() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const nav: any = navigator;
    if (nav.connection?.saveData) {
      setLowPower(true);
    }
  }, []);

  return lowPower;
}
