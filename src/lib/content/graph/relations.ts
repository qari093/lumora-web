export type ContentEdge = {
  from: string;
  to: string;
  type: "related" | "derived" | "reaction";
};

export function linkContent(a: string, b: string): ContentEdge {
  return { from: a, to: b, type: "related" };
}
