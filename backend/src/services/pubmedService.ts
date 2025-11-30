import axios from "axios";
import { Request, Response } from "express";
import Article from "../models/Article";

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

function extractXml(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
    const match = xml.match(regex);
    return match ? match[1].trim() : "";
  }


export const searchArticlesHandler = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  const search = await axios.get(
    `${BASE}/esearch.fcgi?db=pubmed&retmode=json&term=${encodeURIComponent(
      query
    )}&retmax=10`
  );

  const ids = search.data.esearchresult.idlist;

  // fetch summaries
  const summary = await axios.get(
    `${BASE}/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}`
  );

  const results = Object.values(summary.data.result)
    .filter((x: any) => typeof x === "object" && x.uid)
    .map((item: any) => ({
      pmid: item.uid,
      title: item.title,
      authors: item.authors?.map((a: any) => a.name) || [],
      journal: item.fulljournalname,
      year: item.pubdate?.slice(0, 4),
    }));

  res.json({ results });
};

export const getArticleHandler = async (req: Request, res: Response) => {
  const { pmid } = req.params;

  // Check cache
  const cached = await Article.findOne({ pmid });
  if (cached) return res.json({ article: cached });

  const fetch = await axios.get(
    `${BASE}/efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=${pmid}`
  );

  const xml = fetch.data;

  const title = xml.match(/<ArticleTitle>(.*?)<\/ArticleTitle>/)?.[1] || "";
  const abstract = xml.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || "";

  const newArticle = await Article.create({
    pmid,
    title,
    abstract,
    source: "pubmed",
  });

  res.json({ article: newArticle });
};
// Fetch a single PubMed article by PMID (safe, consistent, no missing symbols)
export async function fetchArticleByPmid(pmid: string) {
    try {
      const url = `${BASE}/efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=${pmid}`;
      const response = await axios.get(url);
  
      if (!response.data) return null;
  
      const xml = response.data;
  
      // Parse basic fields
      const title = extractXml(xml, "ArticleTitle");
      const abstract = extractXml(xml, "Abstract");
      const journal = extractXml(xml, "Title");
      const pubDate = extractXml(xml, "PubDate");
      const year = pubDate ? pubDate.slice(0, 4) : undefined;
  
      // If PubMed returns nothing (invalid PMID)
      if (!title) {
        return null;
      }
  
      return {
        pmid,
        title,
        abstract,
        journal,
        year,
        authors: [],      // optional to fill later
        keywords: [],     // optional
        meshTerms: [],    // optional
        source: "pubmed",
      };
    } catch (err) {
      console.error("PubMed fetch error:", err);
      return null;
    }
  }
  
  