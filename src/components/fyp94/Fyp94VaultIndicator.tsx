export function Fyp94VaultIndicator({ unlocked }: { unlocked?: boolean }) {
  return <div data-testid="vault-indicator">{unlocked ? "🔓 Vault Open" : "🔒 Vault Locked"}</div>;
}
