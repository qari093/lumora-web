"use client";

import React from "react";
import { vibeTagsLiteEnabled } from "@/lib/flags/vibeTags";
import VibeWall from "@/components/lumaspace/VibeWall";

export default function VibeWallMount() {
  try {
    if (typeof vibeTagsLiteEnabled === "function" && !vibeTagsLiteEnabled()) return null;
  } catch {
    return null;
  }
  return <VibeWall />;
}
