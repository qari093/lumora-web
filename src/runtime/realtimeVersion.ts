let version = 0;

export function bumpRuntimeVersion() {
  version += 1;
  return version;
}

export function getRuntimeVersion() {
  return version;
}

export function resetRuntimeVersion() {
  version = 0;
}
