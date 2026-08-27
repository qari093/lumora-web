export const GOVERNANCE_ECONOMY_FIREWALL_VERSION = "mega31-v1" as const;

export type GovernanceAuthorityInput = {
  userId?: string | null;
  role?: string | null;
  isAdmin?: boolean;
  delegatedGovernanceAuthority?: boolean;
  zencoinBalance?: number | null;
  walletBalance?: number | null;
  revenue?: number | null;
  followerCount?: number | null;
  engagementScore?: number | null;
  commercialStatus?: string | null;
};

export type GovernanceAuthorityDecision = {
  allowed: boolean;
  basis:
    | "admin_authority"
    | "delegated_governance_authority"
    | "no_governance_authority";
  economySignalsIgnored: true;
  authorityCannotBePurchased: true;
  popularityCannotCreateAuthority: true;
  tokenHoldingsCannotCreateAuthority: true;
};

export function evaluateGovernanceAuthority(
  input: GovernanceAuthorityInput,
): GovernanceAuthorityDecision {
  const delegated =
    input.delegatedGovernanceAuthority === true ||
    input.isAdmin === true ||
    input.role === "admin";

  return {
    allowed: delegated,
    basis:
      input.isAdmin === true || input.role === "admin"
        ? "admin_authority"
        : input.delegatedGovernanceAuthority === true
          ? "delegated_governance_authority"
          : "no_governance_authority",
    economySignalsIgnored: true,
    authorityCannotBePurchased: true,
    popularityCannotCreateAuthority: true,
    tokenHoldingsCannotCreateAuthority: true,
  };
}

export function assertGovernanceEconomyFirewall(): true {
  const richButUnauthorized = evaluateGovernanceAuthority({
    zencoinBalance: Number.MAX_SAFE_INTEGER,
    walletBalance: Number.MAX_SAFE_INTEGER,
    revenue: Number.MAX_SAFE_INTEGER,
    followerCount: Number.MAX_SAFE_INTEGER,
    engagementScore: Number.MAX_SAFE_INTEGER,
    commercialStatus: "highest_tier",
  });

  if (richButUnauthorized.allowed) {
    throw new Error("economic_or_popularity_signal_created_governance_authority");
  }

  const delegated = evaluateGovernanceAuthority({
    delegatedGovernanceAuthority: true,
  });

  if (!delegated.allowed) {
    throw new Error("delegated_governance_authority_not_honored");
  }

  return true;
}
