import express from "express";
import protect from "../middleware/auth.js";
import { generatePlan, getLatestPlan } from "../controllers/planController.js";

const router = express.Router();

router.post("/generate", protect, generatePlan);
router.get("/latest", protect, getLatestPlan);

export default router;
