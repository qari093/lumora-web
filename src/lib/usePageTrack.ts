"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageView } from "./track";

/**
 * Hook to automatically log page views to Lumora analytics.
 */
export function usePageTrack() {
  const path = usePathname();

  useEffect(() => {
    if (!path) return;
    pageView(path);
  }, [path]);
}
