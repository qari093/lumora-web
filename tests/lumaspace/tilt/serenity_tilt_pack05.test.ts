import {describe,it,expect} from "vitest";
import fs from "node:fs";

describe("LumaSpace Ω∞ Code Pack 05/10",()=>{

it("creates serenity tilt hook",()=>{

const s=fs.readFileSync(
"src/hooks/useSerenityTilt.ts",
"utf8"
);

expect(s).toContain("deviceorientation");
expect(s).toContain("--tilt-x");
expect(s).toContain("--tilt-y");

});

it("mounts serenity tilt",()=>{

const r=fs.readFileSync(
"src/components/lumaspace/runtime/LivingUniverseRuntime.tsx",
"utf8"
);

expect(r).toContain("useSerenityTilt");

});

it("locks reduced motion",()=>{

const css=fs.readFileSync(
"src/styles/lumaspace/living-universe.css",
"utf8"
);

expect(css).toContain("prefers-reduced-motion");

});

});
