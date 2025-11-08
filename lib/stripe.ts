import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY || "";
if (!key) {
  console.warn("[stripe] STRIPE_SECRET_KEY missing — API routes will fail until set.");
}
export const stripe = new Stripe(key, {
  apiVersion: "2024-06-20",
});
