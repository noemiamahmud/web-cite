import { useEffect, useState } from "react";
import { listWebs } from "../api/webs";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [webs, setWebs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await listWebs();
      setWebs(data.webs);
    }
    load();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Webs</h1>

      {webs.map((w) => (
        <div
          key={w._id}
          style={{ padding: "1rem", border: "1px solid #ccc", margin: "1rem 0" }}
          onClick={() => navigate(`/web/${w._id}`)}
        >
          <h3>{w.title}</h3>
          <p>{w.description}</p>
        </div>
      ))}
    </div>
  );
}
