import Stripe from "stripe";

/**
 * Local notes:
 * - STRIPE_WEBHOOK_SECRET is REQUIRED to verify incoming webhooks.
 * - STRIPE_API_KEY is only needed if your code calls Stripe APIs.
 */
const apiKey =
  process.env.STRIPE_API_KEY ||
  process.env.STRIPE_SECRET_KEY || // common alt name
  "";

if (!apiKey) {
  console.warn("[stripe:init] STRIPE_API_KEY not set — fine if you only verify webhooks locally.");
}

// Locked API version to known-good value
export const stripe = new Stripe(apiKey || "sk_test_XXXX", {
  apiVersion: "2024-06-20" as any,
});
