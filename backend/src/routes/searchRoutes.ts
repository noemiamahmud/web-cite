import { Router } from "express";
import {
  searchArticlesHandler,
  getArticleHandler,
  getFullTextByPmcid,
} from "../services/pubmedService";

const router = Router();

router.get("/articles", searchArticlesHandler);
router.get("/articles/:pmid", getArticleHandler);
router.get("/articles/fulltext/:pmid", getFullTextByPmcid);

export default router;
