import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});
export const assertStripeKeys = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
};
