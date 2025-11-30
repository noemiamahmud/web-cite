import { Router } from "express";
import {
  searchArticlesHandler,
  getArticleHandler,
} from "../services/pubmedService";

const router = Router();

router.get("/articles", searchArticlesHandler);
router.get("/articles/:pmid", getArticleHandler);

export default router;
