import { ProviderKind, StreamingASR, StreamingMT, StreamingTTS } from "./types";
import { MockASR, MockMT, MockTTS } from "./mockProviders";

export function createASR(kind: ProviderKind): StreamingASR {
  switch (kind) {
    case "mock": return new MockASR();
    default:
      // Future: add real adapters; keep safe default if misconfigured.
      return new MockASR();
  }
}

export function createMT(kind: ProviderKind): StreamingMT {
  switch (kind) {
    case "mock": return new MockMT();
    default:
      return new MockMT();
  }
}

export function createTTS(kind: ProviderKind): StreamingTTS {
  switch (kind) {
    case "mock": return new MockTTS();
    default:
      return new MockTTS();
  }
}
