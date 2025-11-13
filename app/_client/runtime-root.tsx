// FILE: app/_client/runtime-root.tsx
// Finalized Runtime Root — integrated with GestureRuntime for complete mobile gesture system

"use client";

import { Suspense } from "react";
import GestureRuntime from "./gesture-runtime";

import QuantumMirrorWrapper from "./QuantumMirrorWrapper";
import QuantumMirror from "./quantum-mirror";
import AutoRecovery from "./auto-recovery";
import SelfBenchmark from "./self-benchmark";
import OfflinePredict from "./offline-predict";
import OfflineCompress from "./offline-compress";
import DeltaSync from "./delta-sync";
import OfflineRewardTracker from "./offline-reward-tracker";
import AIFaultHealer from "./ai-fault-healer";
import ZenRecovery from "./zen-recovery";
import SyncStatusIndicator from "./sync-status-indicator";
import OfflineStateCapsule from "./offline-state-capsule";
import EmotionBridge from "./emotion-bridge";
import AdaptiveCachePruner from "./adaptive-cache-pruner";
import HoloContinuity from "./holo-continuity";
import SmartStashManager from "./smart-stash";
import MetricsQueue from "./metrics-queue";
import ProximityMagic from "./proximity-magic";
import LocalAiNode from "./local-ai-node";
import SyncRitual from "./sync-ritual";
import PwaRegister from "./pwa-register";

export default function RuntimeRoot() {
  return (
    <>
      {/* Full Gesture Runtime */}
      <Suspense fallback={null}>
        <GestureRuntime />
      </Suspense>

      {/* Core Runtime Mounts */}
      <Suspense fallback={null}>
        <QuantumMirrorWrapper />
        <QuantumMirror />
        <AutoRecovery />
        <SelfBenchmark />
        <OfflinePredict />
        <OfflineCompress />
        <DeltaSync />
        <OfflineRewardTracker />
        <AIFaultHealer />
        <ZenRecovery />
        <SyncStatusIndicator />
        <OfflineStateCapsule />
        <EmotionBridge />
        <div id="light-flash" className="light-flash" />
      </Suspense>

      {/* Background + Continuity Layers */}
      <Suspense fallback={null}>
        <PwaRegister />
        <SyncRitual />
        <LocalAiNode />
        <ProximityMagic />
        <MetricsQueue />
        <SmartStashManager />
        <HoloContinuity />
        <AdaptiveCachePruner />
      </Suspense>

      {/* Portals */}
      <div id="portal-root" />
      <div id="toast-root" />
    </>
  );
}