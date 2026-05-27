import {
  createMemoryCeremony
} from "./memoryCeremony";

import {
  createEchoPortal
} from "../portals/echoPortal";

import {
  createCeremonyShard
} from "./ceremonyShard";

export function runCeremonyRuntime() {
  return {
    ceremony: createMemoryCeremony(),
    portal: createEchoPortal(),
    shard: createCeremonyShard()
  };
}
