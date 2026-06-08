import crypto from "node:crypto";
import { createZendoroStripeClearingTransaction, validateDoubleEntry } from "./ledger";

export interface LafsStripeWebhookInput {
  rawBody: string;
  signatureHeader: string;
  webhookSecret?: string;
}

export interface LafsStripeWebhookResult {
  ok: boolean;
  status: "verified" | "duplicate" | "missing_secret" | "invalid_signature" | "unsupported_event" | "invalid_payload";
  stripeEventId?: string;
  eventType?: string;
  idempotencyKey?: string;
  ledgerReady: boolean;
  errors: string[];
}

export function computeStripeLikeSignature(payload: string, secret: string, timestamp = Math.floor(Date.now() / 1000)): string {
  const signedPayload = `${timestamp}.${payload}`;
  const digest = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  return `t=${timestamp},v1=${digest}`;
}

export function verifyStripeLikeSignature(rawBody: string, signatureHeader: string, secret: string, toleranceSeconds = 300): boolean {
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    })
  );

  const timestamp = Number(parts.t);
  const received = parts.v1;

  if (!Number.isFinite(timestamp) || !received) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - timestamp);
  if (age > toleranceSeconds) return false;

  const expected = computeStripeLikeSignature(rawBody, secret, timestamp).split("v1=")[1];
  return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export function parseStripeWebhook(rawBody: string): any | null {
  try {
    const parsed = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.id !== "string" || typeof parsed.type !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function processLafsStripeWebhook(
  input: LafsStripeWebhookInput,
  seenEventIds = new Set<string>()
): LafsStripeWebhookResult {
  const errors: string[] = [];

  if (!input.webhookSecret) {
    return {
      ok: false,
      status: "missing_secret",
      ledgerReady: false,
      errors: ["stripe_webhook_secret_required"],
    };
  }

  const verified = verifyStripeLikeSignature(input.rawBody, input.signatureHeader, input.webhookSecret);
  if (!verified) {
    return {
      ok: false,
      status: "invalid_signature",
      ledgerReady: false,
      errors: ["invalid_stripe_signature"],
    };
  }

  const event = parseStripeWebhook(input.rawBody);
  if (!event) {
    return {
      ok: false,
      status: "invalid_payload",
      ledgerReady: false,
      errors: ["invalid_json_or_missing_event_fields"],
    };
  }

  if (seenEventIds.has(event.id)) {
    return {
      ok: true,
      status: "duplicate",
      stripeEventId: event.id,
      eventType: event.type,
      idempotencyKey: `stripe:${event.id}`,
      ledgerReady: false,
      errors: [],
    };
  }

  if (event.type !== "payment_intent.succeeded") {
    return {
      ok: true,
      status: "unsupported_event",
      stripeEventId: event.id,
      eventType: event.type,
      idempotencyKey: `stripe:${event.id}`,
      ledgerReady: false,
      errors: [],
    };
  }

  const object = event.data?.object;
  const amount = object?.amount;
  const currency = String(object?.currency || "").toUpperCase();
  const paymentIntentId = object?.id;

  if (!paymentIntentId || currency !== "EUR" || !Number.isSafeInteger(amount) || amount <= 0) {
    errors.push("invalid_payment_intent_payload");
  }

  if (errors.length > 0) {
    return {
      ok: false,
      status: "invalid_payload",
      stripeEventId: event.id,
      eventType: event.type,
      idempotencyKey: `stripe:${event.id}`,
      ledgerReady: false,
      errors,
    };
  }

  const tx = createZendoroStripeClearingTransaction({
    stripeEventId: event.id,
    paymentIntentId,
    amountMinor: amount,
    currency: "EUR",
  });

  const validation = validateDoubleEntry(tx);
  if (!validation.ok) errors.push(...validation.errors);

  seenEventIds.add(event.id);

  return {
    ok: errors.length === 0,
    status: "verified",
    stripeEventId: event.id,
    eventType: event.type,
    idempotencyKey: tx.idempotencyKey,
    ledgerReady: errors.length === 0,
    errors,
  };
}
