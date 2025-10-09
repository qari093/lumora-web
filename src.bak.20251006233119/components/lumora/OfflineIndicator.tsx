"use client";
import React, { useEffect, useState } from "react";

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div style={{
      position:"fixed",
      bottom:20,
      right:20,
      background:"crimson",
      color:"#fff",
      padding:"8px 14px",
      borderRadius:8,
      fontWeight:600,
      zIndex:3000,
      boxShadow:"0 0 12px rgba(0,0,0,0.5)"
    }}>
      ⚡ Offline Mode فعال ہے
    </div>
  );
}
