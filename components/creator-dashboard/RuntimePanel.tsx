"use client";

import { useRuntimeState } from "./useRuntimeState";

export default function RuntimePanel() {
  const state = useRuntimeState();

  if (!state || !state.hasActivity) {
    return <p>No real interaction yet. Go to FYP.</p>;
  }

  return (
    <div>
      <strong>{state.summary}</strong>
      <p>Real runtime signal captured</p>
    </div>
  );
}
