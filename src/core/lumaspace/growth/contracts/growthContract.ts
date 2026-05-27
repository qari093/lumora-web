import type {
  PortalCard,
  SparkInvite,
  GrowthRuntime
} from "../types";

export function validatePortalCard(
  portal: PortalCard
): boolean {
  return Boolean(
    portal.id &&
    portal.title
  );
}

export function validateSparkInvite(
  invite: SparkInvite
): boolean {
  return Boolean(
    invite.id &&
    invite.target
  );
}

export function validateGrowthRuntime(
  runtime: GrowthRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.portalId
  );
}
