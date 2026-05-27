let multiSourceEnabled = true;

export function isMultiSourceFypEnabled(): boolean {
  return multiSourceEnabled;
}

export function enableMultiSourceFyp(): void {
  multiSourceEnabled = true;
}

export function disableMultiSourceFyp(): void {
  multiSourceEnabled = false;
}
