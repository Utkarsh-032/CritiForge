import { Router } from "express";
import { mentor } from "../controllers/mentorController.js";
const router = Router();
router.post("/", mentor);
export default router;
