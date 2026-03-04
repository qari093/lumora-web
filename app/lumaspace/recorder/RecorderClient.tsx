"use client";

import dynamic from "next/dynamic";

const RecorderEngine = dynamic(() => import("@/components/lumaspace/RecorderEngine"), {
  ssr: false,
  loading: () => <div style={{ padding: 16 }}>Loading recorder…</div>,
});

export default function RecorderClient() {
  return <RecorderEngine />;
}
