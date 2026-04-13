"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LumoraSplash() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 60);

    const t2 = setTimeout(() => {
      setExit(true);
    }, 1800);

    const t3 = setTimeout(() => {
      router.replace("/fyp");
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: "radial-gradient(circle at center, #020617 0%, #000814 100%)",
        padding: 24,
        opacity: exit ? 0 : 1,
        transition: "opacity 600ms ease",
      }}
    >
      <section
        style={{
          textAlign: "center",
          transform: visible ? "scale(1)" : "scale(0.97)",
          opacity: visible ? 1 : 0,
          transition: "transform 800ms ease, opacity 800ms ease",
        }}
      >
        <div
          style={{
            padding: 20,
            borderRadius: 24,
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <Image
            src="/brand/lumora-brand-v2.png"
            alt="Lumora"
            width={560}
            height={280}
            priority
            unoptimized
            style={{
              width: "min(460px, 88vw)",
              height: "auto",
              display: "block",
              margin: "0 auto",
              objectFit: "contain",
            }}
          />
        </div>
      </section>
    </main>
  );
}