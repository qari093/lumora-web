"use client";

import { getWorldWhisper, type LumaWorld } from "@/src/core/lumaspace/presence/worldWhisper";

const worlds = [
  { cls:"dream", title:"Dream", icon:"✦" },
  { cls:"wonder", title:"Wonder", icon:"◈" },
  { cls:"creator", title:"Creator", icon:"⬡" },
  { cls:"shadow", title:"Shadow", icon:"◐" },
  { cls:"gaming", title:"Gaming", icon:"◉" },
  { cls:"calm", title:"Calm", icon:"❋" }
];

export default function LivingGlassWorlds(){

return(

<div className="ls-worlds-layer" data-testid="ls-living-glass-worlds">

{worlds.map((w)=>(

<div
key={w.title}
className={`ls-world glass-${w.cls}`}
aria-label={`${w.title} World`}
data-world-whisper={getWorldWhisper(w.cls as LumaWorld).tone}
>

<div className="ls-world-glass"/>

<div className="ls-world-icon">
{w.icon}
</div>

<div className="ls-world-title">
{w.title}
</div>

</div>

))}

</div>

);

}
