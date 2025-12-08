import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { publicFetch } from "../api/apiClient";

type Section = {
  title: string;
  text: string;
};

type Article = {
  pmid: string;
  pmcid?: string | null;
  hasFullText: boolean;
  title: string;
  abstract: string;
  sections?: Section[];
};

function ArticleView() {
    const { pmid } = useParams();
    const location = useLocation();
    const [article, setArticle] = useState<Article | null>(null);
    // const [loading, setLoading] = useState(true);
    
    // if (loading) return <div>Loading...</div>;
    // if (!article) return <div>Article not found</div>;
    useEffect(() => {
        async function fetchArtcile(){
            if (!pmid) return; 
            try {
                const data = await publicFetch(`/api/articles/${pmid}`);
                console.log("THIS IS RESULT OF FETCH", data.article);
                setArticle(data.article);
            } catch (error) {
                console.log("Error fetching article data: ", error);
            }
        }
        fetchArtcile(); 
    }, [pmid]);

    useEffect(() => {
        console.log("ARTICLE STATE UPDATED:", article);
    }, [article]);

    const ar = location.state?.article; 
    console.log("LOCATION ARTICLE: ", ar);
    
    return (
        <div className="article-view">
            <h1>{ar.title}</h1>
            <p>Authors: {ar.authors}</p>
            <p>Journal: {ar.journal}</p>
            <p>Year: {ar.year}</p>
            <p>{pmid}</p>
            {ar.abstract && (
                <>
                <h2>Abstract</h2>
                <p>{ar.abstract}</p>
                </>
            )}
        </div>
  );
}

export default ArticleView;
