import React from "react";
import { useNavigate } from 'react-router-dom';

interface ResultValues {
    pmid: string; 
    title: string; 
}

const SearchResult: React.FC<ResultValues> = ({pmid, title}) => {
    const navigate = useNavigate();

    const handleWebClick = (webId:string) => {
        navigate(`/web/${webId}`);
    };
    
    return (
        <div className="result_view">
            <div key={pmid} className="article-card">
            <h3>{title}</h3>
        </div>
        <button id="web-link" onClick={() => handleWebClick(pmid)}>Create Web</button>
        </div>
    )
}

export default SearchResult; 