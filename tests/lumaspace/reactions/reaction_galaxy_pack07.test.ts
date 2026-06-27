import {describe,it,expect} from "vitest";
import fs from "node:fs";

describe("LumaSpace Ω∞ Code Pack 07/10",()=>{

it("creates reaction galaxy",()=>{

const s=fs.readFileSync(
"src/components/lumaspace/reactions/ReactionGalaxy.tsx",
"utf8"
);

expect(s).toContain("✨");
expect(s).toContain("💙");
expect(s).toContain("🌙");
expect(s).toContain("⚡");

});

it("creates galaxy motion",()=>{

const css=fs.readFileSync(
"src/styles/lumaspace/living-universe.css",
"utf8"
);

expect(css).toContain("reactionFloat");

});

it("mounts galaxy",()=>{

const r=fs.readFileSync(
"src/components/lumaspace/runtime/LivingUniverseRuntime.tsx",
"utf8"
);

expect(r).toContain("ReactionGalaxy");

});

});
