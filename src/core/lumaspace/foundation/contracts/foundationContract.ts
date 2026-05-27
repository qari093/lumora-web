import type {
  FoundationState,
  IdentityState,
  RuntimeSeal
} from "../types";

export function validateFoundation(
  state: FoundationState
): boolean {
  return Boolean(
    state.id &&
    state.status &&
    state.atmosphere
  );
}

export function validateIdentity(
  identity: IdentityState
): boolean {
  return Boolean(
    identity.id &&
    identity.aura
  );
}

export function validateRuntimeSeal(
  seal: RuntimeSeal
): boolean {
  return Boolean(
    seal.active === true &&
    seal.version
  );
}
