"use client";
import React from "react";
import { INITIAL_ECONOMY, type ZenEconomy, loadEconomyFromClient } from "@/lib/zen/economy-core";

type Ctx = {
  state: ZenEconomy;
  setState: React.Dispatch<React.SetStateAction<ZenEconomy>>;
  refresh: () => Promise<void>;
};

const ZenEconomyContext = React.createContext<Ctx | null>(null);

export function useZenEconomy() {
  const ctx = React.useContext(ZenEconomyContext);
  if (!ctx) throw new Error("useZenEconomy must be used within <ZenEconomyProvider />");
  return ctx;
}

// NOTE: We render INITIAL_ECONOMY on first paint (SSR and early CSR are identical),
// then upgrade after hydration in useEffect → no mismatch.
export default function ZenEconomyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ZenEconomy>(INITIAL_ECONOMY);

  const refresh = React.useCallback(async () => {
    const next = await loadEconomyFromClient();
    setState(next);
  }, []);

  React.useEffect(() => {
    // Client-only data load
    refresh();
  }, [refresh]);

  return (
    <ZenEconomyContext.Provider value={{ state, setState, refresh }}>
      {children}
    </ZenEconomyContext.Provider>
  );
}
