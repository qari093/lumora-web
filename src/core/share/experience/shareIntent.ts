import type { CreateShareInput } from "../foundation/types";
import { createShare } from "../sdk/universalShareSdk";
import { getShareDestination, type UniversalShareDestination } from "./destinations";
import { getSupportedShareModes, type UniversalShareMode } from "./modes";

export type UniversalShareIntent = {
  destination: UniversalShareDestination;
  mode: UniversalShareMode;
  input: CreateShareInput;
  confirmationLabel: string;
};

export function createUniversalShareIntent(input: CreateShareInput, destinationId: string, mode: UniversalShareMode = "instant"): UniversalShareIntent {
  const destination = getShareDestination(destinationId);
  if (!destination) throw new Error(`unknown_share_destination:${destinationId}`);

  const supportedModes = getSupportedShareModes(destination).map((item) => item.id);
  if (!supportedModes.includes(mode)) throw new Error(`unsupported_share_mode:${mode}:${destinationId}`);

  return {
    destination,
    mode,
    input: {
      ...input,
      destinationPortal: destination.portal,
      metadata: {
        ...(input.metadata ?? {}),
        transformation: input.metadata?.transformation ?? destination.id,
      },
    },
    confirmationLabel: `${mode}:${destination.label}`,
  };
}

export function materializeShareIntent(intent: UniversalShareIntent) {
  return createShare(intent.input);
}
