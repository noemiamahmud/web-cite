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
    .map((item: any) => {
      const pmcidObj = item.articleids?.find(
        (id: any) => id.idtype === "pmc"
      );
      const pmcid = pmcidObj ? pmcidObj.value : null;
      return {
        pmid: item.uid,
        pmcid,
        title: item.title,
        authors: item.authors?.map((a: any) => a.name) || [],
        journal: item.fulljournalname,
        year: item.pubdate?.slice(0, 4),
      };
    });

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
  //extracting more info for ArticleView 
  const pmcidMatch = xml.match(/<ArticleId IdType="pmc">(PMC\d+)<\/ArticleId>/);
  const pmcid = pmcidMatch ? pmcidMatch[1]: null; 
  const canFullText = !!pmid; 


  const newArticle = await Article.create({
    pmid,
    pmcid, 
    canFullText,
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
      //full text fields 
      const pmcidMatch = xml.match(/<ArticleId IdType="pmc">(PMC\d+)<\/ArticleId>/);
      const pmcid = pmcidMatch ? pmcidMatch[1] : null;
  
      // If PubMed returns nothing (invalid PMID)
      if (!title) {
        return null;
      }
  
      return {
        pmid,
        pmcid,
        canFullText: !!pmcid,
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

//Fetching article full text (when legal to do so)
export const getFullTextByPmcid = async (req: Request, res: Response) => {
  try {
    const { pmcid } = req.params;
    const url = `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/?format=xml`;
    const response = await axios.get(url);
    res.json({
      pmcid, 
      xml: response.data
    });
  } catch (error) {
    console.error("Backend PMC full text fetch failed: ", error);
    res.status(500).json({error: "Failed to fetch full text"});
  }
}