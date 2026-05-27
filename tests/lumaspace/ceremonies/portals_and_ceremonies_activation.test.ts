import { describe, expect, it } from "vitest";

import {
  validateMemoryCeremony,
  validateEchoPortal,
  validateCeremonyShard
} from "@/src/core/lumaspace/ceremonies/contracts/ceremonyContract";

import {
  createMemoryCeremony
} from "@/src/core/lumaspace/ceremonies/runtime/memoryCeremony";

import {
  createEchoPortal
} from "@/src/core/lumaspace/ceremonies/portals/echoPortal";

import {
  createCeremonyShard
} from "@/src/core/lumaspace/ceremonies/runtime/ceremonyShard";

import {
  runCeremonyRuntime
} from "@/src/core/lumaspace/ceremonies/runtime/ceremonyRuntime";

describe("LumaSpace Portals and Ceremonies Activation", () => {
  it("creates memory ceremony", () => {
    const ceremony = createMemoryCeremony();

    expect(
      validateMemoryCeremony(ceremony)
    ).toBe(true);
  });

  it("creates echo portal", () => {
    const portal = createEchoPortal();

    expect(
      validateEchoPortal(portal)
    ).toBe(true);
  });

  it("creates ceremony shard", () => {
    const shard = createCeremonyShard();

    expect(
      validateCeremonyShard(shard)
    ).toBe(true);
  });

  it("runs ceremony runtime", () => {
    const runtime = runCeremonyRuntime();

    expect(
      runtime.ceremony.id
    ).toBe("ceremony_001");

    expect(
      runtime.portal.id
    ).toBe("portal_001");

    expect(
      runtime.shard.id
    ).toBe("shard_001");
  });
});
