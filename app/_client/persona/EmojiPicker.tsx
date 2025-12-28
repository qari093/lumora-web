"use client";

import { useEffect, useMemo, useState } from "react";

type EmojiPickerProps = {
  selected?: string | null; // either id like "emoji_001.png" or url "/persona/emojis/emoji_001.png"
  onSelect?: (idOrUrl: string) => void;
};

type Manifest = {
  ok: boolean;
  emojis?: { count: number; names: string[]; sample?: string[] };
  avatars?: any;
  ts?: string;
};

function normalizeSelectedToName(sel: string | null | undefined): string | null {
  if (!sel) return null;
  // If passed as URL, extract filename
  const m = sel.match(/\/persona\/emojis\/([^/?#]+)$/);
  if (m?.[1]) return m[1];
  // If passed as "emoji_001.png", keep
  if (/^emoji_\d{3}\.png$/.test(sel)) return sel;
  // If passed as "emoji_001" (no ext), normalize
  if (/^emoji_\d{3}$/.test(sel)) return `${sel}.png`;
  return sel;
}

export default function EmojiPicker({ selected = null, onSelect }: EmojiPickerProps) {
  const [names, setNames] = useState<string[]>([]);
  const selectedName = useMemo(() => normalizeSelectedToName(selected), [selected]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/persona/manifest", { cache: "no-store" });
        const j = (await r.json()) as Manifest;
        if (!alive) return;
        if (j?.ok && Array.isArray(j?.emojis?.names)) setNames(j.emojis!.names);
      } catch {
        if (!alive) return;
        setNames([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const items = names;

  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Emojis</div>
        <div className="text-xs text-neutral-500">{items.length || 0}</div>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
        {items.map((n) => {
          const active = selectedName === n;
          const url = `/persona/emojis/${n}`;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onSelect?.(n)}
              title={n}
              className={[
                "relative aspect-square overflow-hidden rounded-md border bg-neutral-50 hover:bg-neutral-100",
                active ? "ring-2 ring-black" : "ring-0",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={n}
                className="h-full w-full object-contain p-1"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>

      {!items.length && (
        <div className="mt-3 text-xs text-neutral-500">
          No emoji assets found. Check <code className="font-mono">/api/persona/manifest</code>.
        </div>
      )}
    </div>
  );
}
