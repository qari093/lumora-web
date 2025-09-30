"use client";
import React from "react";
import type { ReactEngine, EngineProps } from "../../../lib/hub/sdk";
import PixiTD from "../engines/pixi-td-adapter";
import PhaserRogue from "../engines/phaser-rogue-adapter";
import NebulaWasm from "../engines/nebula-wasm-adapter";

export function EngineSwitchHub({
  engine, paused, settings, emit
}:{
  engine: "pixi-td" | "phaser-rogue" | "nebula-wasm";
  paused: boolean;
  settings: any;
  emit: EngineProps["emit"];
}){
  const props: EngineProps = { paused, settings, emit };
  const map: Record<string, ReactEngine> = {
    "pixi-td": PixiTD,
    "phaser-rogue": PhaserRogue,
    "nebula-wasm": NebulaWasm
  };
  const E = map[engine] || (()=> <div>Unknown engine: {engine}</div>);
  return <E {...props} />;
}
