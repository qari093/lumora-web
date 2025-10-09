"use client";
import * as React from "react";
import { useLocalState } from "./useLocalState";

export type Tx = {
  id: string;       // unique id
  ts: number;       // epoch ms
  amount: number;   // positive spent or earned (we use spent as positive for simplicity)
  currency: "ZC+" | "ZC";
  campaign?: string | null;
  note?: string | null;
};

export function useLedger() {
  const [ledger, setLedger] = useLocalState<Tx[]>("wallet.ledger", []);
  function add(tx: Tx) {
    const n = [tx, ...ledger].slice(0, 500);
    setLedger(n);
  }
  function clear() { setLedger([]); }
  return { ledger, add, clear, setLedger };
}
