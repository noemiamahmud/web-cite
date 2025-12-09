import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../api/apiClient";

type SavedWeb = {
  _id: string;
  title: string;
  description?: string;
  createdAt?: string;
};

function MyWebs() {
  const navigate = useNavigate();
  const [webs, setWebs] = useState<SavedWeb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWebs() {
      try {
        const data = await authFetch("/api/webs");
        setWebs(data.webs);
      } catch (err) {
        console.error("Failed to load saved webs:", err);
        setError("Failed to load your saved webs.");
      } finally {
        setLoading(false);
      }
    }

    loadWebs();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading your webs...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!webs.length)
    return <p style={{ textAlign: "center" }}>You haven’t created any webs yet.</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>My Saved Webs</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {webs.map((web) => (
          <div
            key={web._id}
            onClick={() => navigate(`/web/${web._id}`)}
            style={{
              cursor: "pointer",
              padding: "1.25rem",
              borderRadius: "10px",
              border: "1px solid #ccc",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>{web.title}</h3>

            {web.description && (
              <p style={{ color: "#555", marginBottom: "0.5rem" }}>
                {web.description}
              </p>
            )}

            {web.createdAt && (
              <small style={{ color: "#999" }}>
                Created: {new Date(web.createdAt).toLocaleDateString()}
              </small>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyWebs;
