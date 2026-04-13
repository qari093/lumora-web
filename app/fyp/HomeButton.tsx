"use client";

import React from "react";

export default function HomeButton() {
  return (
    <>
      <style>{`
        @keyframes homeBreath {
          0% {
            transform: translateX(-50%) scale(1);
            filter: drop-shadow(0 0 6px rgba(255,170,60,0.35))
                    drop-shadow(0 0 14px rgba(255,140,0,0.18));
          }
          50% {
            transform: translateX(-50%) scale(1.08);
            filter: drop-shadow(0 0 10px rgba(255,180,70,0.65))
                    drop-shadow(0 0 22px rgba(255,150,0,0.32));
          }
          100% {
            transform: translateX(-50%) scale(1);
            filter: drop-shadow(0 0 6px rgba(255,170,60,0.35))
                    drop-shadow(0 0 14px rgba(255,140,0,0.18));
          }
        }
      `}</style>

      <a
        href="/"
        aria-label="Go home"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "78px",
          transform: "translateX(-50%)",
          zIndex: 999,
          width: 64,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          background: "transparent",
        }}
      >
        <img
          src="/ui/home-holo.png"
          alt="home"
          style={{
            width: 52,
            height: 52,
            objectFit: "contain",
            animation: "homeBreath 2.6s ease-in-out infinite",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </a>
    </>
  );
}
