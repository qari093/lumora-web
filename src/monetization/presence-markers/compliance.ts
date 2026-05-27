export function validatePresenceMarker(input: {
  visible: boolean;
  label: string;
  hiddenSubliminal: boolean;
}) {
  return {
    ok:
      input.visible === true &&
      input.label === "Sponsored" &&
      input.hiddenSubliminal === false,
  };
}
