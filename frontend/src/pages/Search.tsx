import { useState } from "react";
//import { useNavigate } from "react-router-dom"; //ADD BACK FOR GOING TO WEBS
import { publicFetch } from "../api/apiClient";
import SearchResult from "../components/searchResult";
import { Link } from "react-router-dom";
import "./parent.css";
import "./search.css";


type ArticleResult = {
    pmid: string; 
    title: string; 
    authors: string[]; 
    journal: string; 
    year?: string; 
};

function Search() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<ArticleResult[]>([]);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return; 
        setError("");
        try{
            const data = await publicFetch(`/api/articles?q=${query}`);
            console.log("SEARCH RESPONSE:", data.results);
            setResult(data.results);
        } catch (error) {
            console.error(error);
            setError("Search failed");
        }
    };

    return(
        <div className="article-search">
            <form onSubmit={handleSearch}>
                <input className="search-input"
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e)=> setQuery(e.target.value)} /> 
            <button className="search-button" type="submit">Search</button>
            </form>
            {error && <p className="error">{error}</p>}
            <div className="search-results">
                {result.map((article) => (
                    <Link key={article.pmid} to={`/article/${article.pmid}`} state={{article}}>
                        <SearchResult
                            pmid={article.pmid}
                            title={article.title} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Search; 