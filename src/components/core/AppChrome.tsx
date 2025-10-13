"use client";
import React from "react";
import FooterNav from "./FooterNav";
import ProBadge from "./ProBadge";
import BatterySaverToggle from "./BatterySaverToggle";
import { usePageTrack } from "@/lib/usePageTrack";

export default function AppChrome() {
  usePageTrack();
  return (
    <>
      <ProBadge />
      <FooterNav />
      <BatterySaverToggle />
    </>
  );
}
