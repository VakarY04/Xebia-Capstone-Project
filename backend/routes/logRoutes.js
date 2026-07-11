import express from "express";
import protect from "../middleware/auth.js";
import { createLog, getLogs } from "../controllers/logController.js";

const router = express.Router();

router.post("/", protect, createLog);
router.get("/", protect, getLogs);

export default router;
