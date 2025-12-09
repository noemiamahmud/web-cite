import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createWebHandler,
  listWebsHandler,
  getWebHandler,
  updateWebHandler,
  deleteWebHandler,
  expandNodeHandler, // ✅ REQUIRED
} from "../services/webService";



const router = Router();

router.use(authMiddleware);
router.post("/", createWebHandler);
router.get("/", listWebsHandler);
router.get("/:id", getWebHandler);
router.put("/:id", updateWebHandler);
router.delete("/:id", deleteWebHandler);
router.patch("/:id", updateWebHandler);
router.post("/:id/expand", expandNodeHandler);


export default router;
