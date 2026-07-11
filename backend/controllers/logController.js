import Log from "../models/Log.js";

// @route POST /api/logs
export const createLog = async (req, res) => {
  try {
    const { dayName, workoutCompleted, mealsFollowed, weightKg, notes, date } = req.body;

    const log = await Log.create({
      user: req.userId,
      date: date || Date.now(),
      dayName,
      workoutCompleted: !!workoutCompleted,
      mealsFollowed: !!mealsFollowed,
      weightKg: weightKg || null,
      notes: notes || "",
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/logs
export const getLogs = async (req, res) => {
  const logs = await Log.find({ user: req.userId }).sort({ date: 1 });
  res.json(logs);
};
