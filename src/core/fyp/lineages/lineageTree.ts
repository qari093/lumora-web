import type {
  LineageNode,
  LineageTree
} from "./types";

export function createLineageTree(input: {
  rootUserId: string;
  nodes: LineageNode[];
}): LineageTree {
  if (!input.rootUserId.trim()) {
    throw new Error("Lineage tree requires rootUserId.");
  }

  const totalImpact = input.nodes.reduce(
    (sum, node) => sum + node.impactContribution,
    0
  );

  return {
    rootUserId: input.rootUserId,
    nodes: input.nodes,
    totalImpact,
    ancestorStatus:
      input.nodes.length >= 10 ||
      totalImpact >= 1000
  };
}

export function addLineageNode(input: {
  tree: LineageTree;
  node: LineageNode;
}): LineageTree {
  return createLineageTree({
    rootUserId: input.tree.rootUserId,
    nodes: [...input.tree.nodes, input.node]
  });
}
