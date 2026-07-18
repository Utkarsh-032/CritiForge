import { Router } from "express";
import { codeReview, websiteReview } from "../controllers/reviewController.js";
const router = Router();
router.post("/website", websiteReview);
router.post("/code", codeReview);
export default router;
