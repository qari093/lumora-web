"use client";

const people = [
  { name:"Ayesha", world:"Wonder", cls:"wonder" },
  { name:"Sara", world:"Dream", cls:"dream" },
  { name:"Hamza", world:"Creator", cls:"creator" },
  { name:"Zayan", world:"Gaming", cls:"gaming" },
  { name:"Rayan", world:"Shadow", cls:"shadow" },
  { name:"Yusra", world:"Calm", cls:"calm" }
];

export default function AmbientHumanPresence(){

return(

<div
className="ls-presence-layer"
data-testid="ls-ambient-human-presence"
>

{people.map((p)=>(

<div
key={p.name}
className={`ls-presence ${p.cls}`}
>

<div className="ls-trace-line"></div>

<div className="ls-presence-dot"></div>

<div className="ls-presence-name">
{p.name}
</div>

<div className="ls-presence-world">
{p.world}
</div>

</div>

))}

</div>

);

}
