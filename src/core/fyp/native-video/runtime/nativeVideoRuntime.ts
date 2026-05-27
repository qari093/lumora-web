import type {
  NativeVideoAsset,
  NativeVideoRuntimeState
} from "../types";

import { evaluateNativeVideo } from "./nativeVideoPolicy";

export function runNativeVideoRuntime(
  assets: NativeVideoAsset[]
): NativeVideoRuntimeState[] {
  return assets.map(evaluateNativeVideo);
}
