"use client";

import React from "react";
import { getDeviceInstallHints } from "@/src/lib/invite/deviceInstall";

export default function InviteInstallHint() {
  const [hint, setHint] = React.useState(
    "Open Lumora and install it from your browser options if available."
  );

  React.useEffect(() => {
    setHint(getDeviceInstallHints(window.navigator.userAgent).installHint);
  }, []);

  return <>{hint}</>;
}
