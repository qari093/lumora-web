"use client";

const whispers = [
"Welcome home.",
"You are safe here.",
"Breathe slowly.",
"Your story matters."
];

export default function NexaCompanion(){

return(

<section
className="ls-nexa-companion"
data-testid="ls-nexa-companion"
>

<div className="ls-nexa-orb">
NEXA
</div>

<div className="ls-nexa-title">
NEXA Companion
</div>

<div className="ls-nexa-whispers">

{whispers.map((w)=>(
<div key={w} className="ls-nexa-whisper">
{w}
</div>
))}

</div>

</section>

);

}
