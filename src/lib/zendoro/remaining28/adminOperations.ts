export const zendoroAdminOperations = {
  sellerApproval: true,
  sellerRejection: true,
  productModeration: true,
  reviewModeration: true,
  refundApproval: true,
  disputeHandling: true,
  payoutReview: true,
  auditExplorer: true,
  rolePermissions: true,
} as const;

export function validateZendoroAdminOperations() {
  return Object.values(zendoroAdminOperations).every(Boolean);
}

export function canZendoroAdmin(action: string, role: "viewer" | "operator" | "owner") {
  if (role === "owner") return true;
  if (role === "operator") return !["payoutReview", "rolePermissions"].includes(action);
  return false;
}
