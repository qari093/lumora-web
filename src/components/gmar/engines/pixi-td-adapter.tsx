"use client";
import React from "react";
import type { ReactEngine, EngineProps } from "../../../lib/hub/sdk";

let TdPixi: any = null;
try { TdPixi = require("../phase3/td-pixi").default; } catch {}

const PixiTDAdapter: ReactEngine = (props: EngineProps) => {
  if (!TdPixi) {
    return <div style={{padding:16,border:"1px dashed #334155",borderRadius:12}}>
      <b>Pixi TD engine missing</b><div style={{opacity:.7,fontSize:12,marginTop:6}}>File not found: src/components/gmar/phase3/td-pixi.tsx</div>
    </div>;
  }
  const { paused, settings, emit } = props;
  return <TdPixi paused={paused} settings={settings}
    onScore={(s:number)=>emit({type:"score",value:s})}
    addCoins={(n:number)=>emit({type:"coins",delta:n})}
  />;
};
export default PixiTDAdapter;
