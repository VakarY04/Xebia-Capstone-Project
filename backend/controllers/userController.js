import User from "../models/User.js";
import Plan from "../models/Plan.js";
import Log from "../models/Log.js";

// @route GET /api/users/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// @route PUT /api/users/onboarding
// Used by all onboarding steps AND the "My Details" edit page.
// Frontend sends only the fields relevant to that step; we merge them in.
export const updateOnboarding = async (req, res) => {
  try {
    const allowedFields = [
      "gender",
      "age",
      "heightCm",
      "weightKg",
      "experienceLevel",
      "goal",
      "injuriesOrConditions",
      "availableDays",
      "workoutLocation",
      "onboardingComplete",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/users/avatar
// Accepts a base64 data URL (e.g. "data:image/png;base64,...") from the frontend.
// Frontend is responsible for resizing/compressing the image before sending it,
// to keep the MongoDB document small.
export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: "No image provided" });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/users/me
// Permanently deletes the user's account and all their data (plans, logs).
export const deleteAccount = async (req, res) => {
  try {
    await Plan.deleteMany({ user: req.userId });
    await Log.deleteMany({ user: req.userId });
    await User.findByIdAndDelete(req.userId);
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
