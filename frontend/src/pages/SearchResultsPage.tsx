import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchArticles } from "../api/articles";
import ArticleCard from "../components/ArticleCard";

export default function SearchResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [params] = useSearchParams();
  const query = params.get("q")!;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchResults() {
      const data = await searchArticles(query);
      setResults(data.results);
      setLoading(false);
    }
    fetchResults();
  }, [query]);

  if (loading) return <p>Loading search results...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Results for: {query}</h2>

      {results.map((a) => (
        <ArticleCard article={a} onSelect={() => navigate(`/create-web/${a.pmid}`)} />
      ))}
    </div>
  );
}
