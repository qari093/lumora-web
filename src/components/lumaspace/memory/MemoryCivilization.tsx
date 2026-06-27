"use client";

const memories = [
  { title:"Story Constellation", icon:"✦", cls:"story" },
  { title:"Echo Memory", icon:"☄", cls:"echo" },
  { title:"Memory Spark", icon:"✧", cls:"spark" },
  { title:"Timeline", icon:"∞", cls:"timeline" }
];

export default function MemoryCivilization(){

return(

<section
className="ls-memory-civilization"
data-testid="ls-memory-civilization"
>

<div className="ls-memory-header">

<div className="ls-memory-title">
Memory Civilization
</div>

<div className="ls-memory-subtitle">
Moments become constellations.
</div>

</div>

<div className="ls-memory-grid">

{memories.map((m)=>(

<div
key={m.title}
className={`ls-memory-card ${m.cls}`}
>

<div className="ls-memory-icon">
{m.icon}
</div>

<div className="ls-memory-name">
{m.title}
</div>

</div>

))}

</div>

</section>

);

}
