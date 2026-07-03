"use client";

import { usePathname } from "next/navigation";
import GlobalPortalNav from "@/components/navigation/GlobalPortalNav";
import HomeBeacon from "@/components/home-beacon/HomeBeacon";

export default function LumoraChromeGate() {
  const pathname = usePathname();

  if (pathname?.startsWith("/lumaspace")) {
    return null;
  }

  return (
    <>
      <GlobalPortalNav />
      <HomeBeacon />
    </>
  );
}
