"use client";

const blooms = [
  { cls:"wonder", icon:"✦" },
  { cls:"calm", icon:"❋" },
  { cls:"dream", icon:"✧" },
  { cls:"creator", icon:"⬡" },
  { cls:"shadow", icon:"◐" }
];

export default function MoodGarden(){

return(

<section
className="ls-mood-garden"
data-testid="ls-mood-garden"
>

<div className="ls-garden-title">
Mood Garden
</div>

<div className="ls-garden-subtitle">
Wonder blooms within you
</div>

<div className="ls-garden-blooms">

{blooms.map((b,i)=>(

<div
key={i}
className={`ls-bloom ${b.cls}`}
>

{b.icon}

</div>

))}

</div>

</section>

);

}
