import express from "express";
import protect from "../middleware/auth.js";
import {
  getMe,
  updateOnboarding,
  updateAvatar,
  deleteAccount,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/onboarding", protect, updateOnboarding);
router.put("/avatar", protect, updateAvatar);
router.delete("/me", protect, deleteAccount);

export default router;
