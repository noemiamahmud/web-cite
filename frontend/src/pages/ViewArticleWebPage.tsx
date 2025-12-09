import { useEffect, useCallback } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    type Node,
    type Edge,
    type Connection,
} from "reactflow";

import "reactflow/dist/style.css";

function mapApiNodes(apiNodes: any[]): Node[] {
    return apiNodes.map((n) => ({
        id: n._id, // mongo ID becomes node id
        position: n.position || { x: 0, y: 0 },
        data: {
            label: n.type || "Node",
            articleId: n.article,
        },
    }));
}

function mapApiEdges(apiEdges: any[]): Edge[] {
    return apiEdges.map((e) => ({
        id: e._id,
        source: e.from,
        target: e.to,
        label: e.relation,
    }));
}


// MAIN///////////////////////

export default function ReactFlowWeb({ webId = "123" }: { webId?: string }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const fetchWeb = useCallback(async () => {
        try {
            const res = await fetch(`/api/web/${webId}`);
            const data = await res.json();

            if (!data.nodes || !data.edges) {
                console.error("Invalid API response:", data);
                return;
            }


            setNodes(mapApiNodes(data.nodes));
            setEdges(mapApiEdges(data.edges));

        } catch (err) {
            console.error("Failed to fetch web:", err);
        }
    }, [webId, setNodes, setEdges]);

    useEffect(() => {
        fetchWeb();
    }, [fetchWeb]);

    const addNode = useCallback(() => {
        const newNode: Node = {
            id: crypto.randomUUID(),
            position: {
                x: Math.random() * 400,
                y: Math.random() * 400,
            },
            data: {
                label: `Node ${nodes.length + 1}`,
            },
        };

        setNodes((nds) => [...nds, newNode]);
    }, [nodes, setNodes]);

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge(connection, eds));
        },
        [setEdges]
    );

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <button
                onClick={addNode}
                style={{
                    position: "absolute",
                    zIndex: 10,
                    top: 20,
                    left: 20,
                    padding: "8px 12px",
                }}
            >
                Add Node
            </button>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
