import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWeb } from "../api/webs";
import GraphCanvas from "../components/GraphCanvas";

export default function WebViewerPage() {
  const { id } = useParams();
  const [web, setWeb] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getWeb(id!);
      setWeb(data.web);
    }
    load();
  }, [id]);

  if (!web) return <p>Loading web...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{web.title}</h2>
      <p>{web.description}</p>

      <GraphCanvas web={web} />
    </div>
  );
}
