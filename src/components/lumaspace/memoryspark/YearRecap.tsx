"use client";

import type { MemorySpark } from "@/src/core/lumaspace/memoryspark/runtime";

export default function YearRecap({ spark }: { spark: MemorySpark }) {
  return (
    <div
      data-testid="lumaspace-year-recap"
      style={{
        borderRadius: 28,
        border: "1px solid rgba(255,255,255,.12)",
        background: "linear-gradient(135deg, rgba(34,211,238,.12), rgba(168,85,247,.12))",
        color: "white",
        padding: 18
      }}
    >
      <strong>{spark.title}</strong>
      <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.66)" }}>
        {spark.scenes.join(" · ")}
      </p>
    </div>
  );
}
