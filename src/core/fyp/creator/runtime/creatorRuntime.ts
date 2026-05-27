import type {
  CreatorProfile,
  CreatorRuntimeState
} from "../types";

export function runCreatorRuntime(
  creators: CreatorProfile[]
): CreatorRuntimeState {
  return {
    active: true,
    creators
  };
}
