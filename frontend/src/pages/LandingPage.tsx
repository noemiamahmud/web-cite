import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ padding: "3rem" }}>
      <h1>Web-Cite</h1>
      <p>Search PubMed articles and generate citation webs</p>

      <SearchBar onSearch={(q) => navigate(`/search?q=${q}`)} />
    </div>
  );
}
