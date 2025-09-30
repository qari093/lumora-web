export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import React from "react";

export default function PulseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
