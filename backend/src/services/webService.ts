import { Request, Response } from "express";
import Web from "../models/Web";
import Article from "../models/Article";
import axios from "axios";

// your local embedding utilities in /utils
import { embedText } from "../utils/embedText";
import { cosineSimilarity } from "../utils/similarity";

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
// NCBI rate-limit friendly params
const NCBI_PARAMS = "&tool=webcite&email=noemiamahmud@gmail.com";

// ---------------- TYPES ----------------

type ArticleMeta = {
  pmid: string;
  title: string;
  abstract: string;
  journal?: string;
  year?: number;
  keywords: string[];
  meshTerms: string[];
};

// ---------------- XML HELPERS ----------------

function matchTag(xml: string, tag: string): string | undefined {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : undefined;
}

async function fetchArticleMeta(pmid: string): Promise<ArticleMeta | null> {
  const url = `${BASE}/efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=${pmid}${NCBI_PARAMS}`;

  const response = await axios.get(url);
  const xml = response.data as string;

  // ----- title -----
  const title =
    matchTag(xml, "ArticleTitle") ||
    matchTag(xml, "BookTitle") ||
    "";

  if (!title) return null;

  // ----- abstract -----
  const abstract =
    matchTag(xml, "AbstractText") ||
    matchTag(xml, "Abstract") ||
    "";

  // ----- journal -----
  const journal =
    matchTag(xml, "FullJournalName") ||
    matchTag(xml, "Title") ||
    undefined;

  // ----- year -----
  const yearStr = matchTag(xml, "Year");
  const year = yearStr ? Number(yearStr) : undefined;

  // ----- keywords -----
  const keywordMatches = [...xml.matchAll(/<Keyword[^>]*>(.*?)<\/Keyword>/g)];
  const keywords = keywordMatches.map((m) => m[1].trim());

  // ----- mesh terms -----
  const meshMatches = [
    ...xml.matchAll(
      /<MeshHeading>[\s\S]*?<DescriptorName[^>]*>(.*?)<\/DescriptorName>[\s\S]*?<\/MeshHeading>/g
    ),
  ];
  const meshTerms = meshMatches.map((m) => m[1].trim());

  return {
    pmid,
    title,
    abstract,
    journal,
    year,
    keywords,
    meshTerms,
  };
}

// ---------------- ARTICLE + EMBEDDING ----------------

async function ensureArticleWithEmbedding(pmid: string) {
  let article: any = await Article.findOne({ pmid });

  // already stored with embedding
  if (article && Array.isArray(article.embedding) && article.embedding.length) {
    return article;
  }

  const meta = await fetchArticleMeta(pmid);
  if (!meta) return null;

  const textForEmbedding = [
    meta.title || "",
    meta.abstract || "",
    `Keywords: ${(meta.keywords || []).join(", ")}`,
    `Mesh: ${(meta.meshTerms || []).join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const embedding = await embedText(textForEmbedding);

  if (!article) {
    // create
    article = await Article.create({
      pmid: meta.pmid,
      title: meta.title,
      abstract: meta.abstract,
      journal: meta.journal,
      year: meta.year,
      authors: [],
      keywords: meta.keywords,
      meshTerms: meta.meshTerms,
      source: "pubmed",
      embedding,
    });
  } else {
    // update
    article.title = meta.title;
    article.abstract = meta.abstract;
    article.journal = meta.journal;
    article.year = meta.year;
    article.keywords = meta.keywords;
    article.meshTerms = meta.meshTerms;
    article.embedding = embedding;
    await article.save();
  }

  return article;
}

// ---------------- SEARCH PUBMED ----------------

async function searchCandidatePmids(meta: ArticleMeta): Promise<string[]> {
  const terms: string[] = [];

  if (meta.keywords.length) terms.push(...meta.keywords);
  if (meta.meshTerms.length) terms.push(...meta.meshTerms);

  // fallback: use title words
  if (terms.length === 0) {
    terms.push(...meta.title.split(/\s+/).slice(0, 8));
  }

  const query = terms.map((t) => `"${t}"`).join(" OR ");

  const search = await axios.get(
    `${BASE}/esearch.fcgi?db=pubmed&retmode=json&term=${encodeURIComponent(
      query
    )}&retmax=25${NCBI_PARAMS}`
  );

  let ids: string[] = search.data?.esearchresult?.idlist || [];
  ids = ids.filter((id) => id !== meta.pmid).slice(0, 15);

  return ids;
}

// ---------------- SIMILARITY VIA LOCAL EMBEDDING ----------------

async function findSimilarArticlesByEmbedding(root: any, meta: ArticleMeta) {
  if (!root.embedding || !Array.isArray(root.embedding)) return [];

  const candidatePmids = await searchCandidatePmids(meta);

  const scored: { article: any; score: number }[] = [];

  for (const pmid of candidatePmids) {
    const candidate = await ensureArticleWithEmbedding(pmid);
    if (!candidate || !candidate.embedding) continue;

    const score = cosineSimilarity(root.embedding, candidate.embedding);
    scored.push({ article: candidate, score });
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map((s) => s.article);
}

// ---------------- HANDLERS ----------------

export const createWebHandler = async (req: any, res: Response) => {
  try {
    const { rootPmid, title, description } = req.body;

    if (!rootPmid || !title) {
      return res
        .status(400)
        .json({ error: "rootPmid and title are required" });
    }

    const root = await ensureArticleWithEmbedding(rootPmid);
    if (!root) {
      return res.status(404).json({
        error: `Could not fetch PubMed article for PMID '${rootPmid}'`,
      });
    }

    const meta: ArticleMeta = {
      pmid: root.pmid,
      title: root.title || "",
      abstract: root.abstract || "",
      journal: root.journal || undefined,
      year: root.year || undefined,
      keywords: root.keywords || [],
      meshTerms: root.meshTerms || [],
    };

    const similarDocs = await findSimilarArticlesByEmbedding(root, meta);

    const nodes = [
      { article: root._id },
      ...similarDocs.map((a) => ({ article: a._id })),
    ];

    const edges = similarDocs.map((a) => ({
      from: root._id,
      to: a._id,
    }));

    const web = await Web.create({
      owner: req.userId,
      title,
      description,
      rootArticle: root._id,
      nodes,
      edges,
    });

    res.json({ web });
  } catch (err) {
    console.error("createWebHandler error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listWebsHandler = async (req: any, res: Response) => {
  const webs = await Web.find({ owner: req.userId }).populate("rootArticle");
  res.json({ webs });
};

export const getWebHandler = async (req: any, res: Response) => {
  const web = await Web.findOne({
    _id: req.params.id,
    owner: req.userId,
  }).populate("nodes.article");

  if (!web) return res.status(404).json({ error: "Web not found" });

  res.json({ web });
};

export const updateWebHandler = async (req: any, res: Response) => {
  const updated = await Web.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    req.body,
    { new: true }
  );

  res.json({ web: updated });
};

export const deleteWebHandler = async (req: any, res: Response) => {
  await Web.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  res.json({ message: "Web deleted" });
};
