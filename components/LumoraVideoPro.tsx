"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle, Gift, Users, Volume2, VolumeX, Sparkles, Crown, Gamepad2, Target, Home, Share2 } from "lucide-react";

export default function LumoraVideoPro({ room = "main-room" }: { room?: string }) {
  const [coins, setCoins] = useState(640);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 text-white">
      <div className="w-full max-w-[430px] aspect-[9/16] rounded-[22px] border border-white/10 shadow-2xl bg-black/40 backdrop-blur flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold">🎥 Room: {room}</h1>
        <p className="mt-2">💰 Balance: {coins} ZC</p>
        <button
          className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded"
          onClick={() => setCoins(c => c + 10)}
        >
          Send Gift (+10 ZC)
        </button>
      </div>
    </div>
  );
}
