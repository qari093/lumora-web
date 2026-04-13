import React from "react";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { resolveInviteAccess, type InviteGateConfig } from "@/src/lib/invite/goAccess";
import InviteInstallHint from "@/src/components/invite/InviteInstallHint";

export const dynamic = "force-static";

function readGate(): InviteGateConfig {
  const fallback: InviteGateConfig = {
    privateBetaEnabled: true,
    waitlistEnabled: true,
    testerAccessMode: "allowlist",
    registrationOpen: false,
    gated: true,
    valid: true,
  };

  try {
    const p = path.join(process.cwd(), ".lumora_softlaunch_waitlist_closed_access.json");
    const raw = fs.readFileSync(p, "utf8");
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export default function LumoraInviteGoPage() {
  const gate = resolveInviteAccess(readGate());

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, rgba(0,180,255,0.22), transparent 35%), linear-gradient(180deg, #04070d 0%, #02040a 100%)",
        color: "#eef6ff",
        padding: "24px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 28,
          padding: 28,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(120,190,255,0.18)",
          boxShadow:
            "0 20px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          textAlign: "center",
        }}
      >
        <img
          src="/lumora-invite.png"
          alt="Lumora Private Beta"
          style={{
            width: 140,
            height: 140,
            objectFit: "cover",
            borderRadius: 28,
            margin: "0 auto 18px",
            display: "block",
            boxShadow: "0 0 60px rgba(0,180,255,0.25)",
          }}
        />

        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8fd8ff",
            marginBottom: 10,
          }}
        >
          Private Beta Access
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(32px, 6vw, 48px)",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
          }}
        >
          Enter Lumora
        </h1>

        <p
          style={{
            margin: "14px auto 0",
            maxWidth: 420,
            fontSize: 16,
            lineHeight: 1.7,
            color: "rgba(238,246,255,0.78)",
          }}
        >
          You’ve been invited to Lumora’s private experience.
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 28 }}>
          {gate.allowAccess ? (
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 54,
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 16,
                color: "#03111f",
                background:
                  "linear-gradient(180deg, rgba(146,235,255,1) 0%, rgba(62,188,255,1) 100%)",
                boxShadow: "0 10px 30px rgba(0,170,255,0.28)",
              }}
            >
              Open Lumora
            </Link>
          ) : (
            <div
              style={{
                minHeight: 54,
                borderRadius: 16,
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Access Limited
            </div>
          )}

          <div
            style={{
              borderRadius: 16,
              padding: "14px 16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(238,246,255,0.72)",
            }}
          >
            {gate.allowAccess ? (
              <InviteInstallHint />
            ) : gate.showWaitlist ? (
              "Private beta access is limited. Waitlist access is currently enabled."
            ) : (
              "Private beta access is currently limited."
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
