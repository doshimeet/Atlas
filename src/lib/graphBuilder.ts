import {
  GraphNode,
  GraphEdge,
  TracedPathData,
  TracedPathHop,
} from "./types";

/**
 * Finds the shortest path between two nodes in the operational graph using Breadth-First Search (BFS).
 */
export function findShortestPath(
  edges: GraphEdge[],
  sourceId: string,
  targetId: string
): { nodeIds: string[]; edgeIds: string[] } | null {
  if (sourceId === targetId) {
    return { nodeIds: [sourceId], edgeIds: [] };
  }

  const adj = new Map<string, Array<{ neighbor: string; edgeId: string }>>();
  for (const edge of edges) {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    if (!adj.has(edge.target)) adj.set(edge.target, []);
    adj.get(edge.source)!.push({ neighbor: edge.target, edgeId: edge.id });
    adj.get(edge.target)!.push({ neighbor: edge.source, edgeId: edge.id });
  }

  const queue: Array<{ node: string; pathNodes: string[]; pathEdges: string[] }> = [
    { node: sourceId, pathNodes: [sourceId], pathEdges: [] },
  ];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.node === targetId) {
      return { nodeIds: current.pathNodes, edgeIds: current.pathEdges };
    }

    const neighbors = adj.get(current.node) || [];
    for (const { neighbor, edgeId } of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({
          node: neighbor,
          pathNodes: [...current.pathNodes, neighbor],
          pathEdges: [...current.pathEdges, edgeId],
        });
      }
    }
  }

  return null;
}

/**
 * Computes traced lineage hops between two nodes for the Lineage Tracer tool.
 */
export function computeTracedPathData(
  edges: GraphEdge[],
  nodesMap: Map<string, GraphNode>,
  sourceId: string,
  targetId: string
): TracedPathData | null {
  const sourceNode = nodesMap.get(sourceId);
  const targetNode = nodesMap.get(targetId);
  if (!sourceNode || !targetNode) return null;

  const path = findShortestPath(edges, sourceId, targetId);
  if (!path) return null;

  const edgesMap = new Map<string, GraphEdge>();
  for (const e of edges) {
    edgesMap.set(e.id, e);
  }

  const hops: TracedPathHop[] = [];
  let totalFinancingM = 0;

  for (let i = 0; i < path.nodeIds.length; i++) {
    const n = nodesMap.get(path.nodeIds[i]);
    if (!n) continue;
    const edgeId = path.edgeIds[i];
    const edge = edgeId ? edgesMap.get(edgeId) : undefined;
    if (edge?.financingAmountM) {
      totalFinancingM += edge.financingAmountM;
    }
    hops.push({ node: n, edge });
  }

  return {
    source: sourceNode,
    target: targetNode,
    hops,
    totalFinancingM,
  };
}
