"use client";
import React from "react";
import dynamic from "next/dynamic";

type Settings = { difficulty: "easy" | "normal" | "hard" };
type EngineProps = {
  paused?: boolean;
  settings: Settings;
  onScore?: (n: number) => void;
  addCoins?: (n: number) => void;
  id?: string;
};

// SSR-safe lazy imports
const TdPixiEngine = dynamic(() => import("./td-pixi"), { ssr: false });
const RogueLite    = dynamic(() => import("./rogue-lite"), { ssr: false });
const MobaLane     = dynamic(() => import("./moba-lane"), { ssr: false });

export function EngineSwitchPhase3({
  id,
  paused = false,
  settings,
  onScore,
  addCoins,
}: { id: string } & EngineProps) {
  if (id === "zen-fortress") return (
    <TdPixiEngine paused={paused} settings={settings} onScore={onScore} addCoins={addCoins} />
  );
  if (id === "zen-rogue") return (
    <RogueLite paused={paused} settings={settings} onScore={onScore} addCoins={addCoins} />
  );
  if (id === "zen-moba") return (
    <MobaLane paused={paused} settings={settings} onScore={onScore} addCoins={addCoins} />
  );
  return <div style={{ padding: 20 }}>Unknown engine: {id}</div>;
}

export default EngineSwitchPhase3;
