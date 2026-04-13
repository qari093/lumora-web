import type { RemoteConfig } from "@/config/remote-config";

export async function fetchRemoteConfig(): Promise<RemoteConfig | null> {
  try {
    const res = await fetch("/api/config", { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json();
    return json?.config ?? null;
  } catch {
    return null;
  }
}
