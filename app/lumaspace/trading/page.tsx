// Location: app/lumaspace/trading/page.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "@/app/_styles/forecast.module.css";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function EmotionTradingGame() {
  const [portfolio, setPortfolio] = useState({
    zenCoin: 1000,
    moodIndex: 50,
  });

  const [data, setData] = useState([
    { emotion: "Joy", value: 60 },
    { emotion: "Calm", value: 45 },
    { emotion: "Focus", value: 70 },
    { emotion: "Curious", value: 55 },
    { emotion: "Anxious", value: 30 },
  ]);

  const handleTrade = (emotion: string, action: "buy" | "sell") => {
    const delta = action === "buy" ? 5 : -5;
    const nextData = data.map((d) =>
      d.emotion === emotion ? { ...d, value: Math.max(0, d.value + delta) } : d
    );
    setData(nextData);

    setPortfolio((p) => ({
      ...p,
      zenCoin: Math.max(0, p.zenCoin + (action === "buy" ? -20 : 20)),
      moodIndex: Math.max(0, Math.min(100, p.moodIndex + delta / 2)),
    }));
  };

  const chartOptions = {
    chart: { type: "bar", height: 320, toolbar: { show: false } },
    xaxis: { categories: data.map((d) => d.emotion) },
    colors: ["#00f3ff", "#ff00c8", "#00ff9d", "#ffd600", "#8e44ad"],
    plotOptions: { bar: { borderRadius: 6, distributed: true } },
  };

  const chartSeries = [{ name: "Emotion Value", data: data.map((d) => d.value) }];

  return (
    <div className={styles.tradingGame}>
      <h1>Emotion Trading Mini-Game</h1>
      <p>Balance: {portfolio.zenCoin} 💰 | Mood Index: {portfolio.moodIndex}</p>

      <div style={{ maxWidth: 700, margin: "20px auto" }}>
        <Chart options={chartOptions} series={chartSeries} type="bar" height={320} />
      </div>

      <div className={styles.actions}>
        {data.map((d) => (
          <div key={d.emotion} className={styles.emotionCard}>
            <strong>{d.emotion}</strong>
            <div>
              <button onClick={() => handleTrade(d.emotion, "buy")}>Buy ↑</button>
              <button onClick={() => handleTrade(d.emotion, "sell")}>Sell ↓</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}