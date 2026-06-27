"use client";

const layers = [
"Public Self",
"Inner Self",
"Privacy Shield",
"Sanctuary Protection"
];

export default function SovereignUniverse(){

return(

<section
className="ls-sovereign-universe"
data-testid="ls-sovereign-universe"
>

<div className="ls-sovereign-title">
Sovereign Universe
</div>

<div className="ls-sovereign-subtitle">
YOUR SPACE. YOUR PEOPLE. YOUR STORY.
</div>

<div className="ls-sovereign-grid">

{layers.map((x)=>(

<div
key={x}
className="ls-sovereign-card"
>

{x}

</div>

))}

</div>

<div className="ls-sovereign-seal">

✦ SEALED ✦

</div>

</section>

);

}
