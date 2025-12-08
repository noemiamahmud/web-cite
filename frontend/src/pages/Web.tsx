import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../api/apiClient";

function Web() {
  const { pmid } = useParams();
  const navigate = useNavigate();
  const [webData, setWebData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWeb() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (!pmid) return;

      try {
        const payload = {
          rootPmid: pmid,
          title: `Web for PMID ${pmid}`,
        };

        const data = await authFetch("/api/webs", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setWebData(data); // ✅ FIXED HERE
      } catch (err) {
        console.error("Error creating web:", err);
        setError("Failed to generate web");
      }
    }

    fetchWeb();
  }, [pmid, navigate]);

  if (error) return <p>{error}</p>;
  if (!webData) return <p>Generating web...</p>;

  return (
    <div>
      <h2>{webData.title}</h2>
      <pre>{JSON.stringify(webData, null, 2)}</pre>
    </div>
  );
}

export default Web;
