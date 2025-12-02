import ForceGraph2D from "react-force-graph-2d";

export default function GraphCanvas({ web }: { web: any }) {
  // Convert backend data → ForceGraph format
  const graphData = {
    nodes: web.nodes.map((n: any) => ({
      id: n.article,
      label: n.article,
    })),
    links: web.edges.map((e: any) => ({
      source: e.from,
      target: e.to,
    })),
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="label"
        nodeAutoColorBy="id"
      />
    </div>
  );
}
