"use client";

/* FILE: app/(demo)/nexmoji/page.original.tsx
   Original Nexmoji page moved behind a client-only boundary for build stability. */

"use client";
import React, { useState } from "react";
import HoloPanel from "@/app/_modules/emojis/holo-panel";
import AvatarBar from "@/app/_modules/avatars/holo-avatar";

export default function Page() {
  const [activeAvatarId, setActiveAvatarId] = useState<string | null>(null);
  const [_prompt, setPrompt] = useState<string>("");

  return (
    <main style={{ padding: 20 }}>
      <AvatarBar
        activeId={activeAvatarId}
        onSelect={(a) => {
          setActiveAvatarId(a.id);
          setPrompt(a.mood ? a.mood : a.name);
        }}
      />
      <HoloPanel enablePulse={true} /* externalPrompt={_prompt} */ />
    </main>
  );
}
