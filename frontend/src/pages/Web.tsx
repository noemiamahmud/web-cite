import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../api/apiClient";
import ReactFlow from "reactflow";
import type { Node, Edge } from "reactflow";

function Web() {
  const { webId } = useParams();
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWeb() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (!webId) return;

      try {
        const data = await authFetch(`/api/webs/${webId}`);
        const web = data.web;

        setTitle(web.title);

        const rfNodes: Node[] = web.nodes.map((n: any) => ({
          id: n.article._id,
          position: n.position || { x: 0, y: 0 },
          data: {
            label: n.article.title || n.article.pmid,
          },
          type: "default",
        }));

        const rfEdges: Edge[] = web.edges.map((e: any) => ({
          id: `${e.from}-${e.to}`,
          source: e.from,
          target: e.to,
          label: e.relation || "",
        }));

        setNodes(rfNodes);
        setEdges(rfEdges);
      } catch (err) {
        console.error("Failed to load web:", err);
        setError("Failed to load graph.");
      }
    }

    loadWeb();
  }, [webId, navigate]);

  // ✅ ✅ NODE CLICK → EXPAND CHILDREN
  const handleNodeClick = useCallback(
    async (_: any, node: Node) => {
      try {
        const children = await authFetch(`/api/webs/${webId}/expand`, {
          method: "POST",
          body: JSON.stringify({
            nodePmid: node.data.label,
          }),
        });

        const newNodes: Node[] = children.children.map((child: any, i: number) => ({
          id: child._id,
          position: {
            x: node.position.x + 200 + i * 120,
            y: node.position.y + 200,
          },
          data: {
            label: child.title || child.pmid,
          },
        }));

        const newEdges: Edge[] = children.children.map((child: any) => ({
          id: `${node.id}-${child._id}`,
          source: node.id,
          target: child._id,
          label: "similarity",
        }));

        setNodes((prev) => [...prev, ...newNodes]);
        setEdges((prev) => [...prev, ...newEdges]);
      } catch (err) {
        console.error("Node expansion failed:", err);
      }
    },
    [webId]
  );

  if (error) return <p>{error}</p>;
  if (!nodes.length) return <p>Loading graph...</p>;

  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <h2 style={{ textAlign: "center" }}>{title}</h2>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}  // ✅ WORKS NOW
        fitView
      />
    </div>
  );
}

export default Web;
