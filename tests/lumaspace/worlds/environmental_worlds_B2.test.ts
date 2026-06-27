import {describe,it,expect} from "vitest";
import fs from "node:fs";
import {
EnvironmentalWorlds,
validateEnvironmentalWorlds
} from "@/src/core/lumaspace/worlds/environmentalWorlds";

describe("LumaSpace Ω∞ Mega Pack B2 — Environmental Worlds",()=>{

it("locks environmental doctrine",()=>{
expect(validateEnvironmentalWorlds()).toBe(true);
expect(EnvironmentalWorlds).toHaveLength(6);
});

it("creates environmental renderer",()=>{
const src=fs.readFileSync(
"src/components/lumaspace/worlds/EnvironmentalWorldEffects.tsx",
"utf8"
);
expect(src).toContain("ls-environment-worlds");
});

it("mounts renderer into runtime",()=>{
const runtime=fs.readFileSync(
"src/components/lumaspace/runtime/LivingUniverseRuntime.tsx",
"utf8"
);
expect(runtime).toContain("EnvironmentalWorldEffects");
});

it("keeps labels hidden",()=>{
expect(EnvironmentalWorlds.every(w=>w.textVisible===false)).toBe(true);
});

});
