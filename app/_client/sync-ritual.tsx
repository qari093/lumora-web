"use client";
import React, { useEffect, useState } from "react";

export default function SyncRitual() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let t: any;
    const animate = () => {
      setActive(true);
      t = setTimeout(() => setActive(false), 2000);
    };
    const onSync = () => animate();
    window.addEventListener("lumora:sync", onSync);
    return () => {
      clearTimeout(t);
      window.removeEventListener("lumora:sync", onSync);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9998,
        pointerEvents: "none",
        opacity: active ? 1 : 0,
        transition: "opacity .6s ease",
        fontSize: "2.5rem",
        color: "#8af",
        textShadow: "0 0 15px rgba(120,200,255,.8)",
      }}
    >
      ✴ Sync Ritual ✴
    </div>
  );
}
