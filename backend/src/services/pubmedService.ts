import axios from "axios";
import { Request, Response } from "express";
import Article from "../models/Article";

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

function extractXml(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
    const match = xml.match(regex);
    return match ? match[1].trim() : "";
  }

function extractAuthors(xml: string): string[] {
  const authorListMatches = xml.match(/<AuthorList>([\s\S]*?)<\/AuthorList>/);
  if (!authorListMatches) return [];

  const authorListXml = authorListMatches[1];
  const authorMatches = [...authorListXml.matchAll(/<Author>([\s\S]*?)<\/Author>/g)];

  return authorMatches.map((match) => {
    const authorXml = match[1];
    const lastName = extractXml(authorXml, "LastName");
    const foreName = extractXml(authorXml, "ForeName");
    const collectiveName = extractXml(authorXml, "CollectiveName"); 

    if (collectiveName) return collectiveName;
    return [foreName, lastName].filter(Boolean).join(" ");
  });
}

function extractYear(xml: string): number | undefined {
  // Try to extract <Year> first
  const yearStr = extractXml(xml, "Year");
  if (yearStr && /^\d{4}$/.test(yearStr)) return Number(yearStr);

  // Fallback: try MedlineDate like "2025 Dec"
  const medlineDate = extractXml(xml, "MedlineDate");
  if (medlineDate) {
    const match = medlineDate.match(/\d{4}/);
    if (match) return Number(match[0]);
  }

  // If all fails, return undefined
  return undefined;
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

  const title = extractXml(xml, "ArticleTitle");
  const abstract = extractXml(xml, "Abstract");
  const journal = extractXml(xml, "Title");
  const pubDate = extractXml(xml, "PubDate");
  const year = extractYear(xml);
  const pmcidMatch = xml.match(/<ArticleId IdType="pmc">(PMC\d+)<\/ArticleId>/);
  const pmcid = pmcidMatch ? pmcidMatch[1] : undefined;
  const authors = extractAuthors(xml);

  const articleData: any = {
    pmid,
    canFullText: !!pmcid,
    title,
    abstract,
    authors,
    journal,
    year,
    source: "pubmed",
  };

  if (pmcid) {
    articleData.pmcid = pmcid;
    try {
      const fullTextRes = await axios.get(
        `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/?format=xml`
      );
      articleData.fullTextXml = fullTextRes.data; // optional, only if full text exists
    } catch (err) {
      console.warn("PMC full text fetch failed:", err);
    }
  }

  let newArticle;
    try {
      newArticle = await Article.create(articleData);
    } catch (err: any) {
      if (err.code === 11000) {
        // duplicate, return existing article
        newArticle = await Article.findOne({ pmid });
      } else {
        throw err;
      }
    }
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