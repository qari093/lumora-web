// FILE: app/lumaspace/converter/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ZenToEmotionConverter() {
  const [zenValue, setZenValue] = useState(50);
  const [emotion, setEmotion] = useState("neutral");

  const mapEmotion = (val: number) => {
    if (val < 20) return "anxious";
    if (val < 40) return "tired";
    if (val < 60) return "neutral";
    if (val < 80) return "focused";
    return "joyful";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setZenValue(v);
    setEmotion(mapEmotion(v));
  };

  const getColor = (emotion: string) => {
    switch (emotion) {
      case "anxious":
        return "#ff6b6b";
      case "tired":
        return "#ffa94d";
      case "neutral":
        return "#ced4da";
      case "focused":
        return "#74c0fc";
      case "joyful":
        return "#63e6be";
      default:
        return "#adb5bd";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0f10] to-[#1a1a1a] text-white p-8">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Zen → Emotion Converter
      </motion.h1>

      <motion.div
        className="w-full max-w-md bg-[#141414] p-6 rounded-xl shadow-lg text-center"
        style={{ border: `1px solid ${getColor(emotion)}` }}
      >
        <p className="mb-3 text-gray-400">Adjust your Zen level</p>
        <input
          type="range"
          min="0"
          max="100"
          value={zenValue}
          onChange={handleChange}
          className="w-full cursor-pointer"
          style={{ accentColor: getColor(emotion) }}
        />
        <motion.div
          className="mt-6 text-2xl font-semibold"
          style={{ color: getColor(emotion) }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {emotion.toUpperCase()}
        </motion.div>
        <p className="mt-2 text-sm text-gray-500">Zen Value: {zenValue}</p>
      </motion.div>
    </div>
  );
}