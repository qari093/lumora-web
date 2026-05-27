export function validateSignalAccuracy(input: {
  signal: any;
  videoId: string;
  creatorId: string;
  witnessId: string;
}) {
  return {
    ok:
      input.signal?.humanOnly === true &&
      input.signal?.videoId === input.videoId &&
      input.signal?.creatorId === input.creatorId &&
      input.signal?.witnessId === input.witnessId &&
      typeof input.signal?.timestampMs === "number",
  };
}
