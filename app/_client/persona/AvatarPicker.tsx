"use client";

import { useEffect, useMemo, useState } from "react";

type AvatarPickerProps = {
  selected?: string | null; // accept "avatar_001.png" OR "neutral/avatar_001.png" OR "/persona/avatars/neutral/avatar_001.png"
  onSelect?: (idOrUrl: string) => void;
};

type Manifest = {
  ok: boolean;
  avatars?: { count: number; byEmotion?: Record<string, number>; sample?: string[] };
  emojis?: any;
  ts?: string;
};

const EMOTIONS = ["neutral", "happy", "sad", "angry", "surprised", "focused", "calm"] as const;
type Emotion = (typeof EMOTIONS)[number];

function parseSelected(sel: string | null | undefined): { emotion: Emotion | null; file: string | null } {
  if (!sel) return { emotion: null, file: null };

  // URL form
  let m = sel.match(/\/persona\/avatars\/([^/]+)\/([^/?#]+)$/);
  if (m?.[1] && m?.[2]) {
    const emo = (m[1] as string) as Emotion;
    if ((EMOTIONS as readonly string[]).includes(emo)) return { emotion: emo, file: m[2] };
    return { emotion: null, file: m[2] };
  }

  // "emotion/avatar_001.png"
  m = sel.match(/^([^/]+)\/(avatar_\d{3}\.png)$/);
  if (m?.[1] && m?.[2]) {
    const emo = (m[1] as string) as Emotion;
    if ((EMOTIONS as readonly string[]).includes(emo)) return { emotion: emo, file: m[2] };
    return { emotion: null, file: m[2] };
  }

  // "avatar_001.png"
  if (/^avatar_\d{3}\.png$/.test(sel)) return { emotion: null, file: sel };

  // "avatar_001"
  if (/^avatar_\d{3}$/.test(sel)) return { emotion: null, file: `${sel}.png` };

  return { emotion: null, file: sel };
}

function avatarFile(idx: number): string {
  const n = String(idx).padStart(3, "0");
  return `avatar_${n}.png`;
}

export default function AvatarPicker({ selected = null, onSelect }: AvatarPickerProps) {
  const parsed = useMemo(() => parseSelected(selected), [selected]);

  const [emotion, setEmotion] = useState<Emotion>(parsed.emotion ?? "neutral");
  const [perEmotion, setPerEmotion] = useState<Record<string, number>>({
    neutral: 120,
    happy: 120,
    sad: 120,
    angry: 120,
    surprised: 120,
    focused: 120,
    calm: 120,
  });

  useEffect(() => {
    // sync emotion if selected provides one
    if (parsed.emotion && parsed.emotion !== emotion) setEmotion(parsed.emotion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed.emotion]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/persona/manifest", { cache: "no-store" });
        const j = (await r.json()) as Manifest;
        if (!alive) return;
        if (j?.ok && j?.avatars?.byEmotion) setPerEmotion(j.avatars.byEmotion);
      } catch {
        // ignore; keep defaults
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const count = perEmotion[emotion] ?? 120;
  const files = useMemo(() => Array.from({ length: count }, (_, i) => avatarFile(i + 1)), [count]);

  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">Avatars</div>
        <div className="text-xs text-neutral-500">
          {emotion} · {count}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {EMOTIONS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEmotion(e)}
            className={[
              "rounded-full border px-3 py-1 text-xs",
              e === emotion ? "bg-black text-white" : "bg-white hover:bg-neutral-50",
            ].join(" ")}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {files.map((f) => {
          const url = `/persona/avatars/${emotion}/${f}`;
          const active = parsed.file === f && (parsed.emotion ? parsed.emotion === emotion : true);
          return (
            <button
              key={f}
              type="button"
              onClick={() => onSelect?.(`${emotion}/${f}`)}
              title={`${emotion}/${f}`}
              className={[
                "relative aspect-square overflow-hidden rounded-md border bg-neutral-50 hover:bg-neutral-100",
                active ? "ring-2 ring-black" : "ring-0",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={f}
                className="h-full w-full object-contain p-1"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
