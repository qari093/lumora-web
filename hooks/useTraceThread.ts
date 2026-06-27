"use client";

import { useState } from "react";

export function useTraceThread() {
  const [open, setOpen] = useState(false);

  return {
    open,
    openThread: () => setOpen(true),
    closeThread: () => setOpen(false),
    toggleThread: () => setOpen(v => !v)
  };
}
