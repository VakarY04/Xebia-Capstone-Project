import User from "../models/User.js";

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
