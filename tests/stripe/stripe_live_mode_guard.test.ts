import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Import route handlers directly (no Next server needed)
import * as Checkout from "@/app/api/stripe/checkout/route";
import * as Webhook from "@/app/api/stripe/webhook/route";

function mkReqJson(url: string, body: any, headers?: Record<string, string>) {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...(headers || {}) },
    body: JSON.stringify(body),
  });
}
function mkReqText(url: string, body: string, headers?: Record<string, string>) {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...(headers || {}) },
    body,
  });
}

const savedEnv: Record<string, string | undefined> = {};
function saveEnv(keys: string[]) {
  for (const k of keys) savedEnv[k] = process.env[k];
}
function restoreEnv(keys: string[]) {
  for (const k of keys) {
    const v = savedEnv[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

describe("stripe live-mode guard", () => {
  const keys = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_ALLOW_LIVE_MODE", "APP_URL"];

  beforeEach(() => {
    saveEnv(keys);
    process.env.APP_URL = "http://127.0.0.1:3000";
delete process.env.STRIPE_ALLOW_LIVE_MODE;
  });

  afterEach(() => {
    restoreEnv(keys);
  });

  it("blocks sk_live_ checkout when STRIPE_ALLOW_LIVE_MODE is not true", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_test_block_me";
    const res = await (Checkout.POST as unknown as (req: Request) => Promise<Response>)(mkReqJson("http://localhost/api/stripe/checkout", { userId: "u1", credits: 1 }));
    expect(res.status).toBe(403);
    const j = await res.json();
    expect(j.ok).toBe(false);
    expect(String(j.error || "")).toContain("stripe_live_mode_blocked");
  });

  it("blocks sk_live_ webhook when STRIPE_ALLOW_LIVE_MODE is not true", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_test_block_me";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_block_me";
    const res = await (Webhook.POST as unknown as (req: Request) => Promise<Response>)(mkReqText("http://localhost/api/stripe/webhook", '{"x":1}', { "stripe-signature": "t=0,v1=bad" }));
    expect(res.status).toBe(403);
    const j = await res.json();
    expect(j.ok).toBe(false);
    expect(String(j.error || "")).toContain("stripe_live_mode_blocked");
  });

  it("allows sk_live_ when STRIPE_ALLOW_LIVE_MODE=true (checkout not 403)", async () => {
    process.env.STRIPE_ALLOW_LIVE_MODE = "true";
    process.env.STRIPE_SECRET_KEY = "sk_live_test_allowed";
    const res = await (Checkout.POST as unknown as (req: Request) => Promise<Response>)(mkReqJson("http://localhost/api/stripe/checkout", { userId: "u1", credits: 1 }));
    expect(res.status).not.toBe(403);
  });

  it("allows sk_live_ when STRIPE_ALLOW_LIVE_MODE=true (webhook not 403; will fail later without valid signature)", async () => {
    process.env.STRIPE_ALLOW_LIVE_MODE = "true";
    process.env.STRIPE_SECRET_KEY = "sk_live_test_allowed";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_allowed";
    const res = await (Webhook.POST as unknown as (req: Request) => Promise<Response>)(mkReqText("http://localhost/api/stripe/webhook", '{"x":1}', { "stripe-signature": "t=0,v1=bad" }));
    expect(res.status).not.toBe(403);
    // should fail on signature
    expect([400, 500]).toContain(res.status);
  });
});
