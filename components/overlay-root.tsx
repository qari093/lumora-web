// components/overlay-root.tsx
"use client";

import { useEffect } from "react";
import dynamicImport from "next/dynamic";

const HomeOverlay = dynamicImport(() => import("./home-overlay"), { ssr: false });
const HomeButton  = dynamicImport(() => import("./home-button"),  { ssr: false });

/** Mount once (e.g., in app/layout.tsx) to enable:
 *  - Global frosted overlay
 *  - ⌘K / Ctrl+K to open
 *  - Home button (fixed, bottom-center)
 */
export default function OverlayRoot({ showButton=true }: { showButton?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const metaK = (e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "k");
      if (metaK) {
        e.preventDefault();
        dispatchEvent(new CustomEvent("lumora:overlay-open"));
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <HomeOverlay />
      {showButton && <HomeButton />}
    </>
  );
}
