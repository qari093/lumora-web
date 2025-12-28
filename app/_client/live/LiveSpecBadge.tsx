"use client";

import { useEffect, useMemo, useState } from "react";

type BadgeMode = "compact" | "expanded";

type SpecV2 = {
  app: string;
  feature: string;
  core_features?: any;
};

type Manifest = {
  ok?: boolean;
  emojis?: { count?: number };
  avatars?: { count?: number };
  ts?: string;
};

async function safeJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default function LiveSpecBadge(props: { mode?: BadgeMode }) {
  const mode: BadgeMode = props.mode ?? "expanded";
  const [spec, setSpec] = useState<SpecV2 | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [warn, setWarn] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const [s, m] = await Promise.all([
        safeJson<{ ok: boolean; spec: SpecV2 }>("/api/live/portal-spec"),
        safeJson<Manifest>("/api/persona/manifest"),
      ]);

      if (!alive) return;

      setSpec(s?.spec ?? null);
      setManifest(m ?? null);

      const e = m?.emojis?.count;
      const a = m?.avatars?.count;
      const okPersona = e === 480 && a === 840;

      if (!s?.spec) setWarn("API warn: portal-spec");
      else if (!m?.ok) setWarn("API warn: persona-manifest");
      else if (!okPersona) setWarn(`Persona warn: ${String(e ?? "—")}/${String(a ?? "—")}`);
      else setWarn("");
    })();
    return () => {
      alive = false;
    };
  }, []);

  const title = useMemo(() => {
    const app = spec?.app ?? "Lumora";
    const feature = spec?.feature ?? "Live Portal";
    return `${app} · ${feature}`;
  }, [spec]);

  const e = manifest?.emojis?.count;
  const a = manifest?.avatars?.count;
  const personaOk = e === 480 && a === 840;

  if (mode === "compact") {
    return (
      <div className="rounded-xl border px-3 py-2 bg-white text-xs">
        <div className="font-semibold">{title}</div>
        <div className="text-neutral-600">
          Persona:{" "}
          <span className={personaOk ? "text-emerald-700" : "text-amber-700"}>
            {personaOk ? "OK" : "WARN"} ({String(e ?? "—")}/{String(a ?? "—")})
          </span>
        </div>
        {warn ? <div className="text-amber-700 mt-1">{warn}</div> : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4 bg-white space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-neutral-600 mt-0.5">
            Spec v2 bound to UI + Persona assets + Portal Hubs
          </div>
        </div>
        <a className="text-xs underline text-neutral-700" href="/api/live/portal-spec">
          spec
        </a>
      </div>

      <div className="text-sm text-neutral-800">
        Persona status:{" "}
        <span className={personaOk ? "text-emerald-700 font-semibold" : "text-amber-700 font-semibold"}>
          {personaOk ? "OK" : "WARN"}
        </span>{" "}
        <span className="text-xs text-neutral-600">
          (emojis {String(e ?? "—")} / avatars {String(a ?? "—")})
        </span>
      </div>

      {warn ? <div className="text-xs text-amber-700">{warn}</div> : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <a className="text-xs underline text-neutral-700" href="/live/room/demo-room">
          demo room
        </a>
        <a className="text-xs underline text-neutral-700" href="/live/hubs">
          portal hubs
        </a>
        <a className="text-xs underline text-neutral-700" href="/api/persona/manifest">
          manifest
        </a>
      </div>
    </div>
  );
}
