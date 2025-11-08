// FILE: app/lumaspace/forecast/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function EmotionForecastGraph() {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const now = new Date();
    const points = Array.from({ length: 24 }, (_, i) => ({
      time: new Date(now.getTime() - (23 - i) * 3600000)
        .toISOString()
        .slice(11, 16),
      value: Math.round(50 + 40 * Math.sin(i / 3) + Math.random() * 10),
    }));
    setLabels(points.map((p) => p.time));
    setData(points.map((p) => p.value));
  }, []);

  const options = {
    chart: { type: "area", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 },
    },
    colors: ["#00f3ff"],
    xaxis: { categories: labels, title: { text: "Time (UTC)" } },
    yaxis: { title: { text: "Emotion Intensity" }, min: 0, max: 100 },
    grid: { borderColor: "rgba(255,255,255,0.1)" },
    theme: { mode: "dark" },
  };

  const series = [{ name: "Emotion Index", data }];

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: "#000" }}>
      <h2 style={{ color: "#0ff", textAlign: "center", marginBottom: "1rem" }}>
        Emotion Forecast (Next 24 Hours)
      </h2>
      <Chart options={options} series={series} type="area" height={400} />
    </div>
  );
}