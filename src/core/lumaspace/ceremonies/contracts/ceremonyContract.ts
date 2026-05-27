import type {
  MemoryCeremony,
  EchoPortal,
  CeremonyShard
} from "../types";

export function validateMemoryCeremony(
  ceremony: MemoryCeremony
): boolean {
  return Boolean(
    ceremony.id &&
    ceremony.title
  );
}

export function validateEchoPortal(
  portal: EchoPortal
): boolean {
  return Boolean(
    portal.id &&
    portal.atmosphere
  );
}

export function validateCeremonyShard(
  shard: CeremonyShard
): boolean {
  return Boolean(
    shard.id &&
    shard.resonance >= 0
  );
}
