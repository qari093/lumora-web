import type { EchoArtifact } from "./artifact";

export type StoredEcho = EchoArtifact & {
  storedAs: "metadata_snapshot";
  replayUrl?: string;
};

export function storeEchoMetadataOnly(echo: EchoArtifact): StoredEcho {
  return {
    ...echo,
    storedAs: "metadata_snapshot",
  };
}
