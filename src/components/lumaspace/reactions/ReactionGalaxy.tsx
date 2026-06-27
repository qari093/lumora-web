"use client";

const reactions = [
  { icon:"✨", cls:"wonder" },
  { icon:"💙", cls:"calm" },
  { icon:"🌙", cls:"dream" },
  { icon:"⚡", cls:"creator" },
  { icon:"🪐", cls:"shadow" },
  { icon:"🎮", cls:"gaming" }
];

export default function ReactionGalaxy(){

return(

<div
className="ls-reaction-galaxy"
data-testid="ls-reaction-galaxy"
>

{reactions.map((r,i)=>(

<div
key={i}
className={`ls-reaction-star ${r.cls}`}
>

{r.icon}

</div>

))}

</div>

);

}
