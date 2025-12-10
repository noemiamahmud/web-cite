import { Handle, Position } from "reactflow";
import "./ArticleNode.css";

export default function ArticleNode({ data }: any) {
    return (
        <div className="article-node">
            <div className="article-title">{data.label}</div>

            <button
                className="article-button"
                onClick={(e) => {
                    e.stopPropagation();
                    window.open(data.url, "_blank");
                }}
            >
                Open Article
            </button>

            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}