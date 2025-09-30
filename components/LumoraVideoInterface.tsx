"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Heart, Gift, Sparkles, Users, Volume2, VolumeX, Gamepad2 } from "lucide-react";

type Ledger = { total: number; value: number };

export default function LumoraVideoInterface({ room }: { room: string }) {
  const [zencoins, setZencoins] = useState(640);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
  const [ledger, setLedger] = useState<Ledger>({ total: 0, value: 0 });

  const gifts = useMemo(() => ([
    { name: "Sparkle",      cost: 10,  icon: "✨" },
    { name: "Fire Wave",    cost: 25,  icon: "🔥" },
    { name: "Diamond Rain", cost: 50,  icon: "💎" },
    { name: "Phoenix Wing", cost: 100, icon: "🐦‍🔥" },
    { name: "Cosmic Portal",cost: 250, icon: "🌌" },
    { name: "AI Genesis",   cost: 500, icon: "🤖" },
  ]), []);

  const notify = (message: string) => {
    const id = Date.now();
    setNotifications((p) => [...p, { id, message }]);
    setTimeout(() => setNotifications((p) => p.filter((n) => n.id !== id)), 2500);
  };

  async function refreshLedger() {
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(room)}/ledger`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLedger({ total: data.total ?? 0, value: data.value ?? 0 });
      }
    } catch {}
  }

  async function sendGift(name: string, cost: number) {
    if (zencoins < cost) return notify("❌ Zencoins کم ہیں");
    setZencoins((z) => z - cost);
    try {
      await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomSlug: room, sender: "user1", giftType: name, value: cost }),
      });
      notify(`�� ${name} بھیجا — +${cost} ZC creator کو`);
      refreshLedger();
    } catch {
      notify("⚠️ Gift بھیجنے میں مسئلہ");
    }
  }

  useEffect(() => { refreshLedger(); }, [room]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col relative overflow-hidden text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full bg-red-500/30 border border-red-400/40 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> <span>Live</span>
          </button>
          <button className="px-3 py-1 rounded-full bg-white/20">Explore</button>
          <button className="px-3 py-1 rounded-full bg-white/20">Following</button>
        </div>
        <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/30">💰 {zencoins} ZC</div>
      </div>

      {/* Stage */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-indigo-800/60" />
        {/* simple hero */}
        <div className="absolute inset-0 flex items-center justify-center text-7xl select-none">🧘</div>

        {/* right rail */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <button onClick={() => { setIsLiked(!isLiked); if (!isLiked) notify("❤️ Like ہوا — +1 ZC creator کو"); }}>
            <Heart className={`w-10 h-10 ${isLiked ? "text-red-400" : "text-white"}`} />
          </button>
          <button onClick={() => setIsMuted((m) => !m)}>
            {isMuted ? <VolumeX className="w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
          </button>
          <button className="w-10 h-10 rounded-full bg-purple-500/30 border border-purple-400/40 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </button>
        </div>

        {/* gifts tray */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-28 w-[min(960px,92%)]">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {gifts.map((g) => (
              <button
                key={g.name}
                onClick={() => sendGift(g.name, g.cost)}
                className="px-3 py-2 rounded-xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 hover:border-purple-300 transition text-left"
              >
                <div className="text-2xl">{g.icon}</div>
                <div className="text-xs">{g.name}</div>
                <div className="text-xs text-yellow-300">{g.cost} ZC</div>
              </button>
            ))}
          </div>
        </div>

        {/* bottom nav + ledger */}
        <div className="absolute bottom-0 w-full bg-black/30 backdrop-blur-lg border-t border-gray-700 px-6 py-3">
          <div className="flex items-center justify-around">
            <span className="text-blue-300">NEXA</span>
            <span className="text-white">🏠</span>
            <span className="text-purple-300 flex items-center gap-1"><Gamepad2 className="w-4 h-4" /> Gmar</span>
          </div>
          <div className="mt-2 text-gray-300 text-xs">
            Ledger — Total: {ledger.total} • Value: {ledger.value} ZC
          </div>
        </div>
      </div>

      {/* notifications */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className="bg-black/80 px-4 py-2 rounded-full text-sm">{n.message}</div>
        ))}
      </div>
    </div>
  );
}
