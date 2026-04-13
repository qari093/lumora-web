export type InternalAdContent = {
  id: string;
  title: string;
  body: string;
  portal: string;
  route: string;
  cta: string;
  kind: "internal_ad";
  active: boolean;
  createdAt: number;
};

export function createInternalAdContent(input: {
  title: string;
  body: string;
  portal: string;
  route: string;
  cta: string;
}): InternalAdContent {
  return {
    id: `ad_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    title: input.title,
    body: input.body,
    portal: input.portal,
    route: input.route,
    cta: input.cta,
    kind: "internal_ad",
    active: true,
    createdAt: Date.now(),
  };
}
