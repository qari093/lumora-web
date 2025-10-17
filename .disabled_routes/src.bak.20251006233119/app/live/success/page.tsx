"use client";
import React from "react";

export default function SuccessPage() {
  React.useEffect(() => {
    // Mark access for MVP (cookie 30 days)
    document.cookie = "live_paid=1; Path=/; Max-Age=2592000; SameSite=Lax";
    const t = setTimeout(() => { window.location.href = "/live/main-room"; }, 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h1>✅ Payment success</h1>
      <p>Access granted. Redirecting to the live room…</p>
      <p><a href="/live/main-room">Go now</a></p>
    </div>
  );
}
