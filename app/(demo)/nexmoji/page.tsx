/* FILE: app/(demo)/nexmoji/page.tsx
   Server wrapper to prevent Next static prerender/export crashes for Nexmoji. */

export const dynamic = "force-dynamic";
export const revalidate = 0;

import NexmojiClient from "./NexmojiClient";

export default function NexmojiPage() {
  return <NexmojiClient />;
}
