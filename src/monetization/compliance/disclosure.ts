export function validateAdDisclosure(input: {
  label: string;
  visible: boolean;
  sponsorName?: string;
}) {
  return {
    ok: input.label === "Sponsored" && input.visible === true && Boolean(input.sponsorName),
    reason:
      input.label === "Sponsored" && input.visible === true && Boolean(input.sponsorName)
        ? "disclosure_valid"
        : "disclosure_invalid",
  };
}
