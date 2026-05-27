export function routeOwnershipValidator(owner: string) {
  return {
    valid: owner.length > 0,
    owner
  };
}
