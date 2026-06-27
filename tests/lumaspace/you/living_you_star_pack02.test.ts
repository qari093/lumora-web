import {describe,it,expect} from "vitest";
import fs from "node:fs";

describe("LumaSpace Ω∞ Code Pack 02/10",()=>{

it("creates YOU star",()=>{

const src=fs.readFileSync(
"src/components/lumaspace/you/LivingYouStar.tsx",
"utf8"
);

expect(src).toContain("YOU");
expect(src).toContain("ls-you-star");

});

it("locks breathing",()=>{

const css=fs.readFileSync(
"src/styles/lumaspace/living-universe.css",
"utf8"
);

expect(css).toContain("youBreath");
expect(css).toContain("6s");

});

it("mounts YOU",()=>{

const page=fs.readFileSync(
"src/components/lumaspace/runtime/LivingUniverseRuntime.tsx",
"utf8"
);

expect(page).toContain("LivingYouStar");

});

});
