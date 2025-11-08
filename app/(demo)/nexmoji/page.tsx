"use client";
import React, { useState } from "react";
import HoloPanel from "@/app/_modules/emojis/holo-panel";
import AvatarBar from "@/app/_modules/avatars/holo-avatar";

export default function Page() {
  const [activeAvatarId, setActiveAvatarId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  return (
    <main style={{ padding: 20 }}>
      <AvatarBar
        activeId={activeAvatarId}
        onSelect={(a) => {
          setActiveAvatarId(a.id);
          setPrompt(a.mood ? a.mood : a.name);
        }}
      />
      <HoloPanel enablePulse={true} /* externalPrompt={prompt} */ />
    </main>
  );
}
