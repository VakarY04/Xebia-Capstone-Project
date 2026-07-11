import express from "express";
import protect from "../middleware/auth.js";
import { getMe, updateOnboarding } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/onboarding", protect, updateOnboarding);

export default router;
