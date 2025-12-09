import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicFetch } from "../api/apiClient";

type Section = {
    id: string;
    title: string;
    text: string;
};

type Article = {
    pmid: string;
    pmcid?: string | null;
    canFullText: boolean; 
    title: string;
    abstract: string;
    authors?: string[];
    journal?: string;
    year?: number;
    sections?: Section[];
    fullTextXml?: string;
};

function escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ArticleView() {
    const { pmid } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [matches, setMatches] = useState<Record<string, { keyword: string; snippet: string }[]>>({});

    function parseAbstract(xml: string): Section[] {
        const abstractMatches = [...xml.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)];
        return abstractMatches.map((match, idx) => {
            const labelMatch = match[0].match(/Label="([^"]+)"/);
            const label = labelMatch ? labelMatch[1] : "Abstract";
            const text = match[1]
                .replace(/&#x2009;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">");
            return { id: `section-${idx}`, title: label, text };
        });
    }

    function parseFullTextSections(xml: string): Section[] {
        const sections: Section[] = [];
        const secMatches = [...xml.matchAll(/<sec[^>]*>([\s\S]*?)<\/sec>/g)];
        secMatches.forEach((match, idx) => {
            const titleMatch = match[0].match(/<title>([\s\S]*?)<\/title>/);
            const title = titleMatch ? titleMatch[1] : `Section ${idx + 1}`;
            const text = match[1]
                .replace(/<[^>]+>/g, "") 
                .replace(/&#x2009;/g, " ")
                .replace(/&amp;/g, "&");
            sections.push({ id: `section-${idx}`, title, text });
        });
        return sections;
    }

    useEffect(() => {
        async function fetchArticle() {
            if (!pmid) return;
            try {
                const data = await publicFetch(`/api/articles/${pmid}`);
                let fullTextSections: Section[] = [];
                if (data.article.fullTextXml) {
                    fullTextSections = parseFullTextSections(data.article.fullTextXml);
                } else {
                    fullTextSections = parseAbstract(data.article.abstract);
                }
                setArticle({ ...data.article, sections: fullTextSections });
            } catch (error) {
                console.log("Error fetching article data: ", error);
            }
        }
        fetchArticle();
    }, [pmid]);

    useEffect(() => {
        if (!article?.sections) return;
        const sectionMatches: Record<string, { keyword: string; snippet: string }[]> = {};
        article.sections.forEach((section) => {
            sectionMatches[section.id] = [];
            keywords.forEach((kw) => {
                const regex = new RegExp(`(?:\\S+\\s+){0,2}${escapeRegex(kw)}(?:\\s+\\S+){0,2}`, "gi");
                const found = section.text.match(regex);
                if (found) {
                    found.forEach((snippet) => {
                        sectionMatches[section.id].push({ keyword: kw, snippet });
                    });
                }
            });
        });
        setMatches(sectionMatches);
    }, [keywords, article?.sections]);

    const handleAddKeyword = () => {
        const trimmed = keywordInput.trim();
        if (trimmed && !keywords.includes(trimmed)) {
            setKeywords((prev) => [...prev, trimmed]);
            setKeywordInput("");
        }
    };

    const handleRemoveKeyword = (index: number) => {
        setKeywords((prev) => prev.filter((_, i) => i !== index));
    };

    if (!article) return <div>Loading...</div>;
    
    return (
        <div style={{ display: "flex" }}>
      <div style={{ width: "200px", padding: "1rem", borderRight: "1px solid #ccc" }}>
        <h3>Search Keywords</h3>
        <div className="keyword-input">
          <input
            type="text"
            placeholder="Enter keyword"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <button onClick={handleAddKeyword}>Add Keyword</button>
        </div>
        {keywords.length > 0 && (
          <div>
            <h4>Keywords</h4>
            <ul>
              {keywords.map((kw, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{kw}</span>
                  <button
                    onClick={() => handleRemoveKeyword(idx)}
                    style={{ cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {Object.keys(matches).length > 0 && (
          <div>
            <h4>Matches</h4>
            <ul>
              {Object.entries(matches).map(([sectionId, sectionMatches]) => (
                <li key={sectionId}>
                  <strong>{article.sections?.find((s) => s.id === sectionId)?.title}</strong>
                  <ul>
                    {sectionMatches.map((m, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            const el = document.getElementById(sectionId);
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          {m.snippet}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: "1rem" }}>
        <h1>{article.title}</h1>
        {article.authors && article.authors.length > 0 && (
          <p>Authors: {article.authors.join(", ")}</p>
        )}
        <p>Journal: {article.journal}</p>
        <p>Year: {article.year}</p>

        <h2>{article.fullTextXml ? "Full Text" : "Abstract"}</h2>
        {article.sections?.map((section) => (
          <div key={section.id} id={section.id}>
            <h3>{section.title}</h3>
            <p>{section.text}</p>
          </div>
        ))}

        {!article.canFullText && (
          <a
            href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View full article on PubMed
          </a>
        )}
      </div>
    </div>
    );
}

export default ArticleView;

