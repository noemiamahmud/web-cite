import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../api/apiClient";
import ReactFlow, {
  useNodesState,
  useEdgesState
} from "reactflow";

import type { Node, Edge } from "reactflow";

import { autoLayout } from "../utils/autoLayout";
import ArticleNode from "./ArticleNode";

import "reactflow/dist/style.css";
import "./Web.css";

// Register custom node type
const nodeTypes = {
  article: ArticleNode,
};

function Web() {
  const { webId } = useParams();
  const navigate = useNavigate();

  // ReactFlow state hooks (dragging supported)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

        // Convert backend nodes → ReactFlow nodes
        const rfNodes: Node[] = web.nodes.map((n: any) => ({
          id: n.article._id,
          position: n.position || { x: 0, y: 0 },
          type: "article",
          data: {
            label: n.article.title || n.article.pmid,
            url:
              n.article.url ||
              `https://pubmed.ncbi.nlm.nih.gov/${n.article.pmid}`,
          },
        }));

        // Convert backend edges → ReactFlow edges
        const rfEdges: Edge[] = web.edges.map((e: any) => ({
          id: `${e.from}-${e.to}`,
          source: e.from,
          target: e.to,
          label: e.relation || "",
        }));

        // Layout once (only on load)
        const laidOut = autoLayout(rfNodes, rfEdges);

        setNodes(laidOut);
        setEdges(rfEdges);
      } catch (err) {
        console.error("Failed to load web:", err);
        setError("Failed to load graph.");
      } finally {
        setLoading(false);
      }
    }

    loadWeb();
  }, [webId, navigate]);


  // NODE CLICK → EXPAND CHILDREN
  const handleNodeClick = useCallback(
    async (_: any, node: Node) => {
      try {
        const res = await authFetch(`/api/webs/${webId}/expand`, {
          method: "POST",
          body: JSON.stringify({
            nodePmid: node.id,
          }),
        });

        const newNodes: Node[] = res.children.map((child: any, i: number) => ({
          id: child._id,
          position: {
            x: node.position.x + 240,
            y: node.position.y + i * 140,
          },
          type: "article",
          data: {
            label: child.title || child.pmid,
            url:
              child.url ||
              `https://pubmed.ncbi.nlm.nih.gov/${child.pmid}`,
          },
        }));

        const newEdges: Edge[] = res.children.map((child: any) => ({
          id: `${node.id}-${child._id}`,
          source: node.id,
          target: child._id,
          label: "similarity",
        }));

        //De-duplicate nodes so ReactFlow never crashes
        setNodes((prev) => {
          const existing = new Set(prev.map((n) => n.id));
          const filtered = newNodes.filter((n) => !existing.has(n.id));
          return [...prev, ...filtered];
        });

        setEdges((prev) => [...prev, ...newEdges]);
      } catch (err) {
        console.error("Expansion failed:", err);
      }
    },
    [webId]
  );

  if (error) return <p>{error}</p>;
  if (loading) return <p style={{ textAlign: "center" }}>Loading graph...</p>;
  if (!nodes.length) return <p>Loading graph...</p>;

  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <h2 className="web-header">{title}</h2>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      />
    </div>
  );
}

export default Web;