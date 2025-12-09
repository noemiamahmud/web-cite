import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../api/apiClient";
import "./MyWebs.css";

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
      <div className="mywebs-container">
          <h2>My Saved Webs</h2>
    
          <div className="web-list">
            {webs.map(web => (
              <div 
                key={web._id}
                className="web-card"
                onClick={() => navigate(`/web/${web._id}`)}
              >
                <h3>{web.title}</h3>
                {web.description && <p>{web.description}</p>}
                {web.createdAt && (
                  <small>Created: {new Date(web.createdAt).toLocaleDateString()}</small>
                )}
              </div>
            ))}
          </div>
      </div>
    );
    
}

export default MyWebs;
