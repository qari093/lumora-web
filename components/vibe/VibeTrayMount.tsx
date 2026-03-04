"use client";

import * as React from "react";
import VibeTray from "@/components/vibe/VibeTray";
import { vibeTagsLiteEnabled } from "@/lib/flags/vibeTags";

export default function VibeTrayMount(props: { userId?: string; videoId?: string; watchMs?: number }) {
  const enabled = (() => {
    try {
      return typeof vibeTagsLiteEnabled === "function" ? !!vibeTagsLiteEnabled() : false;
    } catch {
      return false;
    }
  })();

  if (!enabled) return null;

  const watchMs = Number.isFinite(props.watchMs as any) ? Math.max(0, Number(props.watchMs)) : 0;

  return <VibeTray userId={props.userId} videoId={props.videoId} watchMs={watchMs} />;
}
