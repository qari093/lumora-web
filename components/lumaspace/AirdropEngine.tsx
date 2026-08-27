// components/lumaspace/AirdropEngine.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

type AirdropStatus =
  | "idle"
  | "checking"
  | "eligible"
  | "ineligible"
  | "claiming"
  | "claimed"
  | "error";

export interface AirdropEngineProps {
  /** Optional debug label for inspection in dev tools */
  debugTag?: string;
  /** Whether to auto-check eligibility on mount. Default: true. */
  autoCheck?: boolean;
  /** Optional className override for outer wrapper */
  className?: string;
}

interface AuraSnapshot {
  eligible: boolean;
  reason?: string;
  raw?: unknown;
}

interface ClaimResult {
  ok: boolean;
  txId?: string;
  message?: string;
  raw?: unknown;
}

/**
 * LumaSpace AirdropEngine
 *
 * Lightweight client-only controller that:
 * - checks current user's airdrop eligibility via /api/lumaspace/aura
 * - claim mutation is disabled until an authenticated transactional claim endpoint is available
 * - never throws; all errors are surfaced as non-fatal UX messages
 *
 * NOTE: This is intentionally conservative about assumptions:
 * - treats response shapes as opaque, only probes common fields when present
 * - failures never break the rest of the LumaSpace UI
 */
export default function AirdropEngine(props: AirdropEngineProps) {
  const {
    debugTag,
    autoCheck = true,
    className,
  } = props;

  const [status, setStatus] = useState<AirdropStatus>("idle");
  const [aura, setAura] = useState<AuraSnapshot | null>(null);
  const [claim, setClaim] = useState<ClaimResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const nowIso = () => new Date().toISOString();

  const resetMessages = useCallback(() => {
    setMessage(null);
    setClaim((prev) => prev && { ...prev, message: prev.message });
  }, []);

  const parseAuraResponse = (raw: any): AuraSnapshot => {
    if (!raw || typeof raw !== "object") {
      return { eligible: false, raw };
    }

    // Try to infer eligibility; be defensive.
    if ("eligible" in raw && typeof raw.eligible === "boolean") {
      return {
        eligible: raw.eligible,
        reason:
          typeof raw.reason === "string"
            ? raw.reason
            : raw.eligible
              ? "Eligible for LumaSpace airdrop."
              : "Not eligible for LumaSpace airdrop.",
        raw,
      };
    }

    // Fallback: treat presence of some positive signal as eligibility
    if ("score" in raw && typeof raw.score === "number" && raw.score > 0) {
      return {
        eligible: true,
        reason: "Eligible based on aura score.",
        raw,
      };
    }

    return {
      eligible: false,
      reason: "No eligibility signal found in aura payload.",
      raw,
    };
  };

  const parseClaimResponse = (raw: any): ClaimResult => {
    if (!raw || typeof raw !== "object") {
      return { ok: false, message: "Unexpected response from wallet endpoint.", raw };
    }

    const ok =
      ("ok" in raw && typeof raw.ok === "boolean" && raw.ok) ||
      ("success" in raw && typeof raw.success === "boolean" && raw.success);

    const txId =
      typeof raw.txId === "string"
        ? raw.txId
        : typeof raw.tx_id === "string"
          ? raw.tx_id
          : undefined;

    let message: string | undefined;
    if (typeof raw.message === "string") {
      message = raw.message;
    } else if (!ok) {
      message = "Wallet endpoint reported failure.";
    }

    return { ok, txId, message, raw };
  };

  const checkEligibility = useCallback(async () => {
    resetMessages();
    setStatus("checking");
    setAura(null);
    setLastCheckedAt(null);

    try {
      const res = await fetch("/api/lumaspace/aura", {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      const data = await res
        .json()
        .catch(() => ({}));

      const snapshot = parseAuraResponse(data);
      setAura(snapshot);
      setLastCheckedAt(nowIso());

      if (!snapshot.eligible) {
        setStatus("ineligible");
        if (snapshot.reason) {
          setMessage(snapshot.reason);
        } else {
          setMessage("You are currently not eligible for an airdrop.");
        }
        return;
      }

      setStatus("eligible");
      if (snapshot.reason) {
        setMessage(snapshot.reason);
      } else {
        setMessage("You are eligible for a LumaSpace airdrop.");
      }
    } catch (err) {
      console.error("AirdropEngine: aura check failed", err);
      setStatus("error");
      setMessage("Could not check airdrop eligibility. Please try again later.");
    }
  }, [resetMessages]);

  const claimAirdrop = useCallback(async () => {
    setClaim(null);
    setStatus("error");
    setMessage(
      "Airdrop claiming is temporarily unavailable during private beta. Eligibility checks remain available."
    );
  }, [])

  useEffect(() => {
    if (!autoCheck) return;
    void checkEligibility();
  }, [autoCheck, checkEligibility]);

  const badgeText = useMemo(() => {
    switch (status) {
      case "idle":
        return "Idle";
      case "checking":
        return "Checking eligibility…";
      case "eligible":
        return "Eligible";
      case "ineligible":
        return "Not eligible";
      case "claiming":
        return "Claiming…";
      case "claimed":
        return "Claimed";
      case "error":
        return "Error";
      default:
        return status;
    }
  }, [status]);

  const canCheck = status === "idle" || status === "ineligible" || status === "error";
  const canClaim = false;

  return (
    <section
      className={
        className ??
        "rounded-xl border border-border/60 bg-background/60 p-4 md:p-5 shadow-sm space-y-3"
      }
      data-lumaspace-airdrop-status={status}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500/80 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]" />
            <h2 className="text-sm font-medium">
              LumaSpace Airdrop
              {debugTag ? (
                <span className="ml-1 text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                  · {debugTag}
                </span>
              ) : null}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Check whether you&apos;re eligible for a LumaSpace credit airdrop. Claiming is temporarily unavailable during private beta
            into your wallet.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-border/60 px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground bg-background/80">
          {badgeText}
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void checkEligibility()}
          disabled={!canCheck}
          className="inline-flex items-center justify-center rounded-md border border-border/70 px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "checking" ? "Checking…" : "Check eligibility"}
        </button>
        <button
          type="button"
          onClick={() => void claimAirdrop()}
          disabled={!canClaim}
          className="inline-flex items-center justify-center rounded-md border border-emerald-500/70 bg-emerald-500/90 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "claiming" ? "Claiming…" : "Claim airdrop"}
        </button>
      </div>

      <div className="space-y-1 text-xs">
        {message && (
          <p
            className={
              status === "error" || status === "ineligible"
                ? "text-red-500"
                : "text-muted-foreground"
            }
          >
            {message}
          </p>
        )}
        {lastCheckedAt && (
          <p className="text-[0.7rem] text-muted-foreground/70">
            Last checked: {lastCheckedAt}
          </p>
        )}
      </div>

      {Boolean(aura?.raw) && (
        <details className="mt-1">
          <summary className="cursor-pointer text-[0.7rem] text-muted-foreground underline underline-offset-2">
            Debug: aura snapshot
          </summary>
          <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-muted/60 p-2 text-[0.7rem] leading-snug">
            {JSON.stringify(aura?.raw, null, 2)}
          </pre>
        </details>
      )}

      {Boolean(claim?.raw) && (
        <details className="mt-1">
          <summary className="cursor-pointer text-[0.7rem] text-muted-foreground underline underline-offset-2">
            Debug: claim response
          </summary>
          <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-muted/60 p-2 text-[0.7rem] leading-snug">
            {JSON.stringify(claim?.raw, null, 2)}
          </pre>
        </details>
      )}
    </section>
  );
}
