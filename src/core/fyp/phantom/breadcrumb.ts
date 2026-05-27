export type PhantomBreadcrumb = {
  breadcrumbId: string;
  userId: string;
  fragment: string;
  clueStrength: number;
  discoveredAt: number;
};

export function createPhantomBreadcrumb(input: {
  userId: string;
  fragment: string;
  clueStrength: number;
  now?: number;
}): PhantomBreadcrumb {
  if (!input.userId.trim() || !input.fragment.trim()) {
    throw new Error("Phantom breadcrumb requires userId and fragment.");
  }

  if (input.clueStrength < 1 || input.clueStrength > 100) {
    throw new Error("Phantom breadcrumb clueStrength out of range.");
  }

  const now = input.now ?? Date.now();

  return {
    breadcrumbId: `breadcrumb_${input.userId}_${now}`,
    userId: input.userId,
    fragment: input.fragment,
    clueStrength: input.clueStrength,
    discoveredAt: now
  };
}

export function qualifiesForPhantomHint(
  breadcrumbs: PhantomBreadcrumb[]
): boolean {
  const totalStrength = breadcrumbs.reduce(
    (sum, breadcrumb) => sum + breadcrumb.clueStrength,
    0
  );

  return breadcrumbs.length >= 3 && totalStrength >= 120;
}
