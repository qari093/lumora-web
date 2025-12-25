"use client";

import * as React from "react";
import { fetchEmmlChart } from "@/app/_client/emml-chart-client";

type ChartState = any;

export default function EmmlChartPage(): JSX.Element {
  const [data, setData] = React.useState<ChartState>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetchEmmlChart();
        if (alive) setData(res);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "failed");
      }
    })();
    return () => { alive = false; };
  }, []);

  if (err) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <h1>EMML Chart</h1>
        <p style={{ opacity: 0.8 }}>Error loading chart: {err}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <h1>EMML Chart</h1>
        <p style={{ opacity: 0.8 }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h1>EMML Chart</h1>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
