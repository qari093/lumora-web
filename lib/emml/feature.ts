
function _normFlag(v: unknown): string {
  if (v == null) return "";
  return String(v).trim().toLowerCase();
}

function _isFalseyFlag(v: unknown): boolean {
  const x = _normFlag(v);
  return (
    x === "" ||
    x === "0" ||
    x === "false" ||
    x === "f" ||
    x === "no" ||
    x === "n" ||
    x === "off" ||
    x === "disable" ||
    x === "disabled"
  );
}

export function isEmmlEnabled(): boolean {
  const raw = process.env.EMML_ENABLED;
  // default: enabled if unset
  if (raw == null) return true;
  if (_isFalseyFlag(raw)) return false;
  // treat any other explicit value as enabled
  return true;
}

export function getEmmlDisabledReason(): string | null {
  return isEmmlEnabled() ? null : "EMML_DISABLED";
}

export function getEmmlDisableReason(): string | null {
  if (isEmmlEnabled()) return null;
  const r = process.env.EMML_DISABLE_REASON;
  const norm = _normFlag(r);
  if (norm) return String(r);
  return "EMML is disabled";
}
