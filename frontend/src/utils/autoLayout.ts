import dagre from "dagre";
import type { Node, Edge } from "reactflow";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export function autoLayout(nodes: Node[], edges: Edge[]) {
  if (!nodes.length) return nodes; // ✅ safety guard

  dagreGraph.setGraph({
    rankdir: "TB",
    ranksep: 120,
    nodesep: 80,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 260, height: 120 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - 130,
        y: pos.y - 60,
      },
    };
  });
}
