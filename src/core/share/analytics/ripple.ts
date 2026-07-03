import type { RippleEdge, RippleGraph, RippleNode, ShareAnalyticsEvent } from "./types";

export function createRippleGraph(shareId: string, events: ShareAnalyticsEvent[]): RippleGraph {
  const nodes: RippleNode[] = events.map((event, index) => ({
    id: `ripple_${event.shareId}_${event.actorId}_${index}`,
    shareId: event.shareId,
    portal: event.portal,
    actorId: event.actorId,
    depth: index,
    influence: Number((event.weight * (1 + index * 0.08)).toFixed(4)),
  }));

  const edges: RippleEdge[] = nodes.slice(1).map((node, index) => ({
    from: nodes[index].id,
    to: node.id,
    strength: Number(Math.min(1, (nodes[index].influence + node.influence) / 2).toFixed(4)),
  }));

  return {
    shareId,
    nodes,
    edges,
    totalInfluence: Number(nodes.reduce((sum, node) => sum + node.influence, 0).toFixed(4)),
  };
}

export function summarizeRippleGraph(graph: RippleGraph) {
  const portals = Array.from(new Set(graph.nodes.map((node) => node.portal)));

  return {
    portalReach: portals.length,
    peopleReached: new Set(graph.nodes.map((node) => node.actorId)).size,
    totalInfluence: graph.totalInfluence,
    hasConversationSpark: graph.nodes.some((node) => node.portal === "lumalink" || node.portal === "live"),
  };
}
