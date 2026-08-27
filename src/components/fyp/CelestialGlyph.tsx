type Name =
| "deep"
| "board"
| "share"
| "space"
| "home"
| "flow"
| "live"
| "trace";

export default function CelestialGlyph({
name,
size=24
}:{name:Name,size?:number}){

const s={
width:size,
height:size,
viewBox:"0 0 24 24",
fill:"none",
stroke:"currentColor",
strokeWidth:"1.8",
strokeLinecap: "round" as const,
strokeLinejoin: "round" as const
};

const icons={

deep:
<g>
<polygon points="12,3 18,9 12,15 6,9"/>
<line x1="12" y1="9" x2="12" y2="20"/>
<polyline points="9,17 12,20 15,17"/>
</g>,

board:
<g>
<polygon points="7,7 12,2 17,7 12,12"/>
<polygon points="7,17 12,12 17,17 12,22"/>
<line x1="12" y1="2" x2="12" y2="22"/>
</g>,

share:
<g>
<circle cx="12" cy="12" r="2"/>
<path d="M12 3V7"/>
<path d="M12 17V21"/>
<path d="M3 12H7"/>
<path d="M17 12H21"/>
<path d="M5 5L8 8"/>
<path d="M16 16L19 19"/>
</g>,

space:
<g>
<polygon points="12,2 22,12 12,22 2,12"/>
<path d="M12 6L13.5 10H18L14.5 12.5L16 17L12 14.5L8 17L9.5 12.5L6 10H10.5Z"/>
</g>,

home:
<g>
<polygon points="12,2 21,10 18,10 18,21 6,21 6,10 3,10"/>
</g>,

flow:
<g>
<path d="M8 3C8 7 8 11 8 21"/>
<path d="M12 1C12 7 12 13 12 23"/>
<path d="M16 3C16 7 16 11 16 21"/>
</g>,

live:
<g>
<circle cx="12" cy="12" r="3"/>
<circle cx="12" cy="12" r="8"/>
</g>,

trace:
<g>
<circle cx="4" cy="12" r="1.5"/>
<path d="M6 12H15" strokeDasharray="2 2"/>
<polyline points="13,9 18,12 13,15"/>
<circle cx="20" cy="12" r="1.5"/>
</g>

};

return(
<svg
{...s}
className="text-cyan-100 drop-shadow-[0_0_14px_rgba(34,211,238,.55)]"
>
{icons[name]}
</svg>
);

}
