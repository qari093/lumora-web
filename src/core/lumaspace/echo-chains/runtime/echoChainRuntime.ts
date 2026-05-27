import {
  createEchoChain
} from "./echoChainBuilder";

import {
  createChainLink
} from "../social/chainLink";

export function runEchoChainRuntime() {
  return {
    active: true,
    chain: createEchoChain(),
    link: createChainLink()
  };
}
