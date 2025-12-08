import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
} from "reactflow";
import type { Node, Edge, Connection } from "reactflow";

import "reactflow/dist/style.css";
import { useCallback } from "react";

//// CODE ////////////////////////////////

const initialNodes: Node[] = [
    {
        id: "1",
        position: { x: 250, y: 0 },
        data: { label: "Article 1" },
    },
];

const initialEdges: Edge[] = [];

export default function ReactFlowTest() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Function to add a new node
    const addNode = useCallback(() => {
        const newNode: Node = {
            id: crypto.randomUUID(), // unique ID
            position: {
                x: Math.random() * 400,
                y: Math.random() * 400,
            },
            data: { label: `Node ${nodes.length + 1}` },
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
                onConnect={onConnect}   // REQUIRED: makes edges stick
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}