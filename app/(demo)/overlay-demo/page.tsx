"use client";
import dynamic from "next/dynamic";
import UasLite from "@/app/_client/uas-lite";
import OverlayCoachOnce from "@/app/_client/overlay-coach-once";
import OverlayCloseGestures from "@/app/_client/overlay-close-gestures";
import GestureDialog from "@/app/_client/gesture-dialog";

const HomeOverlay = dynamic(() => import("../../../components/home-overlay").catch(() => ({ default: () => null })), { ssr: false });
const HomeButton = dynamic(() => import("../../../components/home-button").catch(() => ({ default: () => null })), { ssr: false });

export default function OverlayDemoPage() {
  return (
    <main style={{ minHeight: "140vh", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Lumora Overlay Demo</h1>
      <p style={{ opacity: 0.7, marginBottom: 16 }}>Scroll down or tap the Home orb to open the overlay.</p>
      <div style={{ height: "120vh", background: "linear-gradient(180deg, rgba(123,187,255,.18), rgba(255,140,205,.18))", borderRadius: 16, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.05)", padding: 16 }}>
        <p>Background content for blur sampling…</p>
      </div>
      <HomeOverlay />
      <HomeButton />
      <UasLite />
      <OverlayCoachOnce />
      <GestureDialog />
          <OverlayCloseGestures />
    </main>
  );
}
