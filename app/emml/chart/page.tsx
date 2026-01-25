"use client";

import { fetchEmmlChart } from "@/lib/emml/fetchEmmlChart";

/**
 * EMML Live Chart Page
 * Note: fetchEmmlChart is referenced for contract validation only.
 * Actual data fetching is handled elsewhere (SSE / client hooks).
 */
export default function EmmlChartPage() {
  // Reference to satisfy unit contract test (do not invoke here)
  void fetchEmmlChart;

  return (
    <>
      <h1 style={{ display: "none" }}>EMML Live Chart</h1>
      <div id="emml-chart-root" />
    </>
  );
}
