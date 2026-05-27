import type {
  MemoryCeremony
} from "../types";

export function createMemoryCeremony(): MemoryCeremony {
  return {
    id: "ceremony_001",
    title: "Midnight Echo",
    active: true
  };
}
