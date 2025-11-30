import { Router } from "express";
import {
  signupHandler,
  loginHandler,
  meHandler,
  logoutHandler,
} from "../services/authService";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.get("/me", authMiddleware, meHandler);
router.post("/logout", logoutHandler);

export default router;
