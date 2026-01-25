import { Consent } from "./types";

export class ConsentError extends Error {
  readonly code = "consent_required";
  constructor(msg = "translation_consent_required") {
    super(msg);
  }
}

export function assertConsent(consent: Consent | null | undefined): asserts consent is Consent {
  if (!consent?.granted) throw new ConsentError();
  // Enforce no-storage invariant at contract level
  if (!consent.scope?.storeNothing) throw new ConsentError("no_storage_required");
}


/**
 * Privacy guard: translation must be no-storage by default.
 * Throws if config implies storage/logging of user content.
 */
export function assertNoStorage(privacy: any): void {
  // Default policy: NO storage. If privacy is omitted, we treat it as no-storage allowed.
  const p = privacy ?? {};

  // Explicit storage intent must be rejected.
  // Common flags we treat as "store": allowStorage=true, noStorage=false, store/persist/save/log=true.
  const wantsStorage =
    p.allowStorage === true ||
    p.noStorage === false ||
    p.store === true ||
    p.persist === true ||
    p.save === true ||
    p.log === true ||
    p.retentionDays > 0;

  if (wantsStorage) {
    throw new Error("privacy_no_storage_required");
  }

  // Otherwise OK (implicitly no-storage).
}

