import { describe, expect, it } from "vitest";

import {
  validateEchoChain,
  validateChainLink,
  validateEchoChainRuntime
} from "@/src/core/lumaspace/echo-chains/contracts/echoChainContract";

import {
  createEchoChain
} from "@/src/core/lumaspace/echo-chains/runtime/echoChainBuilder";

import {
  createChainLink
} from "@/src/core/lumaspace/echo-chains/social/chainLink";

import {
  runEchoChainRuntime
} from "@/src/core/lumaspace/echo-chains/runtime/echoChainRuntime";

describe("LumaSpace Echo Chains Activation", () => {
  it("creates echo chain", () => {
    const chain = createEchoChain();

    expect(
      validateEchoChain(chain)
    ).toBe(true);
  });

  it("creates chain link", () => {
    const link = createChainLink();

    expect(
      validateChainLink(link)
    ).toBe(true);
  });

  it("runs echo chain runtime", () => {
    const runtime = runEchoChainRuntime();

    expect(
      validateEchoChainRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.link.id
    ).toBe("link_001");
  });
});
