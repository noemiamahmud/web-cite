import React from "react";
import { useNavigate } from 'react-router-dom';
import "./searchResult.css";
import { authFetch } from "../api/apiClient";




interface ResultValues {
  pmid: string;
  title: string;
}

const SearchResult: React.FC<ResultValues> = ({ pmid, title }) => {
  const navigate = useNavigate();

  const handleWebClick = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const payload = {
        rootPmid: pmid,
        title: title,
        description: `Web for ${title}`,
      };

      const data = await authFetch("/api/webs", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // ✅ VERY IMPORTANT: backend returns { web }
      const webId = data.web?._id;

      if (!webId) {
        throw new Error("No web ID returned from server");
      }

      navigate(`/web/${webId}`);
    } catch (err) {
      console.error("Failed to create web:", err);
      alert("Failed to create web. Are you logged in?");
    }
  };

  return (
    <div className="result_view">
      <div className="article-card">
        <h3>{title}</h3>
      </div>

      <button id="web-link" onClick={handleWebClick}>
        Create Web
      </button>
    </div>
  );
};

export default SearchResult;
