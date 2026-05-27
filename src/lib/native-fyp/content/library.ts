import type { NativeFypContentManifest } from "./manifest";

export function addToNativeLibrary(
  library: NativeFypContentManifest[],
  item: NativeFypContentManifest
): NativeFypContentManifest[] {
  if (library.some((x) => x.videoId === item.videoId)) return library;
  return [...library, item];
}

export function listNativeLibrary(library: NativeFypContentManifest[]): NativeFypContentManifest[] {
  return [...library].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
