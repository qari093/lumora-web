/* FILE: app/(demo)/hybrid-demo/page.tsx
   Server wrapper to prevent prerendering failures without using next/dynamic ssr:false (not allowed in Server Components). */

export const dynamic = "force-dynamic";
export const revalidate = 0;

import HybridDemoClient from "./HybridDemoClient";

export default function HybridDemoPage() {
  return <HybridDemoClient />;
}
