import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();

// Phase 3 will implement:
// POST /api/plans/generate  -> calls Gemini API, saves a new Plan, returns it
// GET  /api/plans/latest    -> returns the user's most recent plan
router.get("/latest", protect, (req, res) => {
  res.json({ message: "Plan generation coming in Phase 3" });
});

export default router;
