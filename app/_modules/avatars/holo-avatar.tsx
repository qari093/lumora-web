// LOCATION: app/_modules/avatars/holo-avatar.tsx
"use client";

import React from "react";
import { selectAvatar, setMood } from "@/app/_modules/emotion/emotion-model";

export type Avatar = {
  id: string;
  name: string;
  imageUrl?: string;   // optional photo URL
  mood?: string;       // e.g., "happy", "calm", "angry"
  accent?: string;     // ring color (hex)
};

// Sample avatars (you can replace with real data)
const SAMPLE_AVATARS: Avatar[] = [
  { id: "ava-1", name: "Naya Noor", mood: "happy",  accent: "#00f3ff" },
  { id: "ava-2", name: "Zayn",      mood: "calm",   accent: "#00ff9d" },
  { id: "ava-3", name: "Isha",      mood: "love",   accent: "#ff00c8" },
  { id: "ava-4", name: "Rafi",      mood: "angry",  accent: "#ff6b6b" },
  { id: "ava-5", name: "Arooj",     mood: "focus",  accent: "#f59e0b" },
];

export function HoloAvatar({
  avatar,
  active = false,
  onClick,
}: {
  avatar: Avatar;
  active?: boolean;
  onClick?: (a: Avatar) => void;
}) {
  const initials = avatar.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <button
      className={`holo-avatar ${active ? "active" : ""}`}
      onClick={() => onClick?.(avatar)}
      title={`${avatar.name}${avatar.mood ? ` • ${avatar.mood}` : ""}`}
      aria-label={avatar.name}
    >
      <span className="ring" style={{ borderColor: avatar.accent ?? "#00f3ff" }} />
      {avatar.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar.imageUrl} alt={avatar.name} />
      ) : (
        <span className="initials">{initials}</span>
      )}

      <style jsx>{`
        .holo-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            120% 120% at 30% 30%,
            rgba(255, 255, 255, 0.35),
            rgba(255, 255, 255, 0.05) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
          transform: translateZ(0);
          transition: transform 0.15s ease, box-shadow 0.2s ease,
            border-color 0.2s ease;
        }
        .holo-avatar:hover {
          transform: translateY(-2px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.32);
        }
        .holo-avatar.active {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35),
            0 14px 36px rgba(0, 0, 0, 0.36);
        }
        .ring {
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          border: 2px solid;
          opacity: 0.8;
          filter: blur(2px);
          pointer-events: none;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .initials {
          font-weight: 800;
          letter-spacing: 0.5px;
          background: linear-gradient(45deg, #00f3ff, #ff00c8, #00ff9d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 18px;
        }
      `}</style>
    </button>
  );
}

export default function AvatarBar({
  avatars = SAMPLE_AVATARS,
  onSelect,
  activeId,
}: {
  avatars?: Avatar[];
  onSelect?: (a: Avatar) => void;
  activeId?: string | null;
}) {
  return (
    <div className="avatar-bar">
      {avatars.map((a) => (
        <HoloAvatar
          key={a.id}
          avatar={a}
          active={activeId === a.id}
          onClick={onSelect}
        />
      ))}

      <style jsx>{`
        .avatar-bar {
          display: flex;
          gap: 10px;
          padding: 6px 4px 10px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}