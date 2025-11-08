"use client";
export default function LightFlash({ show }: { show: boolean }) {
  return <div className={`light-flash ${show ? "on" : ""}`} aria-hidden="true" />;
}
