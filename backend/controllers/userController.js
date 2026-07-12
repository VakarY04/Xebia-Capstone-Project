import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Plan from "../models/Plan.js";
import Log from "../models/Log.js";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const normalizeWeeklyAvailability = (weeklyAvailability = [], availableDays = []) => {
  const fallbackDays = Array.isArray(availableDays) ? availableDays : [];
  const weekMap = new Map(
    weeklyAvailability.map((entry) => [entry.weekNumber, entry.days || fallbackDays])
  );

  return [1, 2, 3, 4].map((weekNumber) => {
    const rawDays = weekMap.get(weekNumber) || fallbackDays;
    const sanitizedDays = [...new Set(rawDays.filter((day) => daysOfWeek.includes(day)))];
    return { weekNumber, days: sanitizedDays };
  });
};

const normalizeUserForResponse = (userDoc) => {
  const user = typeof userDoc.toObject === "function" ? userDoc.toObject() : userDoc;
  const availableDays = Array.isArray(user.availableDays) ? user.availableDays : [];
  const weeklyAvailability = normalizeWeeklyAvailability(user.weeklyAvailability, availableDays);

  return {
    ...user,
    availableDays,
    weeklyAvailability,
  };
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(normalizeUserForResponse(user));
};

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
      "weeklyAvailability",
      "workoutLocation",
      "onboardingComplete",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const normalizedAvailableDays = Array.isArray(updates.availableDays)
      ? [...new Set(updates.availableDays.filter((day) => daysOfWeek.includes(day)))]
      : undefined;

    const normalizedWeeklyAvailability = normalizeWeeklyAvailability(
      updates.weeklyAvailability,
      normalizedAvailableDays || updates.availableDays || []
    );

    if (normalizedAvailableDays) {
      updates.availableDays = normalizedAvailableDays;
    }

    if (req.body.weeklyAvailability !== undefined || req.body.availableDays !== undefined) {
      updates.weeklyAvailability = normalizedWeeklyAvailability;

      const mergedAvailableDays = [...new Set(normalizedWeeklyAvailability.flatMap((entry) => entry.days))];
      updates.availableDays = mergedAvailableDays;
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    }).select("-password");

    res.json(normalizeUserForResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: "No image provided" });

    const user = await User.findByIdAndUpdate(req.userId, { avatar }, { new: true }).select("-password");
    res.json(normalizeUserForResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please fill in both fields" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
