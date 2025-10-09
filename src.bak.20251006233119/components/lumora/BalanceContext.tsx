"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TreasuryService } from "./TreasuryService";

type Tx = { id:number; type:string; amount:number; time:string };
type Toast = { id:number; msg:string; color:string };

type BalanceContextType = {
  balance: number;
  add: (amt:number, meta?:{note?:string})=>void;
  spend: (amt:number, meta?:{note?:string})=>void;
  clear: ()=>void;
  txs: Tx[];
  toasts: Toast[];
  removeToast: (id:number)=>void;

  staked: number;
  apy: number;
  pendingRewards: number;
  stake: (amt:number)=>void;
  unstake: (amt:number)=>void;
  claimRewards: ()=>void;

  myCode: string;
  myReferrerCode: string | null;
  referralEarnings: number;
  setReferrer: (code:string)=>void;
  simulateReferredActivity: (earnAmount:number)=>void;
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);
const isBrowser = typeof window !== "undefined";
const nowStr = () => new Date().toLocaleTimeString();

// ---------- Provider ----------
export function BalanceProvider({ children }: { children: React.ReactNode }) {
  // wallet + history
  const [balance, setBalance] = useState<number>(() =>
    isBrowser ? parseInt(localStorage.getItem("balance") ?? "100") : 100
  );
  const [txs, setTxs] = useState<Tx[]>(() =>
    isBrowser ? JSON.parse(localStorage.getItem("txs") ?? "[]") : []
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  // staking
  const [staked, setStaked] = useState<number>(() =>
    isBrowser ? parseInt(localStorage.getItem("staked") ?? "0") : 0
  );
  const [apy] = useState<number>(0.10);
  const [rewardAccrued, setRewardAccrued] = useState<number>(() =>
    isBrowser ? parseFloat(localStorage.getItem("rewardAccrued") ?? "0") : 0
  );

  // IMPORTANT: SSR-safe init (no Date.now() during render)
  const [lastRewardTs, setLastRewardTs] = useState<number>(0);
  useEffect(() => {
    if (!isBrowser) return;
    const saved = localStorage.getItem("lastRewardTs");
    setLastRewardTs(saved ? parseInt(saved) : Date.now());
  }, []);
  useEffect(() => {
    if (isBrowser) localStorage.setItem("lastRewardTs", String(lastRewardTs));
  }, [lastRewardTs]);

  // referrals
  const [myCode, setMyCode] = useState<string>("LUM-XXXXXX");
  useEffect(() => {
    if (!isBrowser) return;
    let c = localStorage.getItem("myRefCode");
    if (!c) {
      c = "LUM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      localStorage.setItem("myRefCode", c);
    }
    setMyCode(c);
  }, []);

  const [myReferrerCode, setMyReferrerCode] = useState<string | null>(() =>
    isBrowser ? (localStorage.getItem("myReferrerCode") || null) : null
  );
  const [referralEarnings, setReferralEarnings] = useState<number>(() =>
    isBrowser ? parseInt(localStorage.getItem("referralEarnings") ?? "0") : 0
  );

  // persist
  useEffect(() => { if (isBrowser) localStorage.setItem("balance", String(balance)); }, [balance]);
  useEffect(() => { if (isBrowser) localStorage.setItem("txs", JSON.stringify(txs)); }, [txs]);
  useEffect(() => { if (isBrowser) localStorage.setItem("staked", String(staked)); }, [staked]);
  useEffect(() => { if (isBrowser) localStorage.setItem("rewardAccrued", String(rewardAccrued)); }, [rewardAccrued]);
  useEffect(() => { if (isBrowser) localStorage.setItem("myReferrerCode", myReferrerCode ?? ""); }, [myReferrerCode]);
  useEffect(() => { if (isBrowser) localStorage.setItem("referralEarnings", String(referralEarnings)); }, [referralEarnings]);

  // toasts / tx log (client-only usage)
  const pushToast = (msg:string, color:string) => {
    const id = Date.now() + Math.floor(Math.random()*1000);
    setToasts(t => [...t, { id, msg, color }]);
    setTimeout(() => removeToast(id), 3000);
  };
  const removeToast = (id:number) => setToasts(t => t.filter(x => x.id !== id));
  const logTx = (type:string, amt:number) =>
    setTxs(t => [{ id: Date.now(), type, amount: amt, time: nowStr() }, ...t]);

  // staking accrual (start only after mount + baseline set)
  useEffect(() => {
    if (!isBrowser || lastRewardTs === 0) return;
    const iv = setInterval(() => {
      const now = Date.now();
      const dtMs = now - lastRewardTs;
      if (dtMs <= 0 || staked <= 0) { setLastRewardTs(now); return; }
      const dtDays = dtMs / (1000*60*60*24);
      const earned = staked * apy * dtDays;
      if (earned > 0) {
        setRewardAccrued(r => r + earned);
        setLastRewardTs(now);
      }
    }, 2000);
    return () => clearInterval(iv);
  }, [lastRewardTs, staked, apy]);

  const pendingRewards = useMemo(() => Math.floor(rewardAccrued), [rewardAccrued]);

  // wallet ops
  const add = (amt:number, meta?:{note?:string}) => {
    setBalance(b => b + amt);
    logTx(meta?.note ?? "Earned", amt);
    pushToast(`+${amt}⚡ ${meta?.note ?? "Earned"}`, "limegreen");
  };
  const spend = (amt:number, meta?:{note?:string}) => {
    setBalance(b => Math.max(0, b - amt));
    logTx(meta?.note ?? "Spent", -amt);
    pushToast(`-${amt}⚡ ${meta?.note ?? "Spent"}`, "crimson");
  };
  const clear = () => setTxs([]);

  // stake ops
  const stake = (amt:number) => {
    if (amt <= 0) return;
    if (balance < amt) { pushToast("Insufficient balance to stake", "crimson"); return; }
    setBalance(b => b - amt);
    setStaked(s => s + amt);
    TreasuryService.lock(amt);
    setLastRewardTs(Date.now());
    logTx("Staked", -amt);
    pushToast(`Staked ${amt}⚡`, "gold");
  };
  const unstake = (amt:number) => {
    if (amt <= 0) return;
    if (staked < amt) { pushToast("Not enough staked to unstake", "crimson"); return; }
    setStaked(s => s - amt);
    setBalance(b => b + amt);
    TreasuryService.unlock(amt);
    setLastRewardTs(Date.now());
    logTx("Unstaked", amt);
    pushToast(`Unstaked ${amt}⚡`, "gold");
  };
  const claimRewards = () => {
    if (pendingRewards <= 0) { pushToast("No rewards to claim", "gold"); return; }
    const r = pendingRewards;
    setRewardAccrued(x => x - r);
    setBalance(b => b + r);
    logTx("Staking Reward", r);
    pushToast(`+${r}⚡ Staking Reward`, "limegreen");
  };

  // referrals
  const setReferrer = (code:string) => {
    if (!code || code === myCode) { pushToast("Invalid referrer code", "crimson"); return; }
    setMyReferrerCode(code);
    pushToast(`Referrer set: ${code}`, "gold");
  };
  const simulateReferredActivity = (earnAmount:number) => {
    if (earnAmount <= 0) { pushToast("Invalid referred activity", "crimson"); return; }
    const bonus = Math.floor(earnAmount * 0.01);
    setReferralEarnings(e => e + bonus);
    setBalance(b => b + bonus);
    logTx("Referral Bonus", bonus);
    pushToast(`+${bonus}⚡ Referral Bonus`, "limegreen");
  };

  return (
    <BalanceContext.Provider value={{
      balance, add, spend, clear, txs, toasts, removeToast,
      staked, apy, pendingRewards, stake, unstake, claimRewards,
      myCode, myReferrerCode, referralEarnings, setReferrer, simulateReferredActivity
    }}>
      {children}
    </BalanceContext.Provider>
  );
}

// ---------- Hook ----------
export function useBalance(){
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error("useBalance must be inside BalanceProvider");
  return ctx;
}