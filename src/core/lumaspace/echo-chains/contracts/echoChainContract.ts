import type {
  EchoChain,
  ChainLink,
  EchoChainRuntime
} from "../types";

export function validateEchoChain(
  chain: EchoChain
): boolean {
  return Boolean(
    chain.id &&
    chain.depth > 0 &&
    chain.atmosphere
  );
}

export function validateChainLink(
  link: ChainLink
): boolean {
  return Boolean(
    link.id &&
    link.userId &&
    link.duration > 0
  );
}

export function validateEchoChainRuntime(
  runtime: EchoChainRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    validateEchoChain(runtime.chain)
  );
}
