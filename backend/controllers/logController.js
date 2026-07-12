import Log from "../models/Log.js";

const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const pad = (value) => String(value).padStart(2, "0");

const deriveDateKey = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    const today = new Date();
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const getDayNameFromDateKey = (dateKey) => {
  const date = new Date(`${dateKey}T12:00:00Z`);
  return weekdayNames[date.getUTCDay()];
};

const getDateFromDateKey = (dateKey) => new Date(`${dateKey}T12:00:00.000Z`);

const serializeLog = (log) => ({
  ...log.toObject(),
  dateKey: log.dateKey || deriveDateKey(log.date),
});

// @route POST /api/logs
export const createLog = async (req, res) => {
  try {
    const { workoutCompleted, mealsFollowed, weightKg, waterLiters, notes } = req.body;

    const dateKey = deriveDateKey(req.body.date || req.body.dateKey);
    const dayName = req.body.dayName || getDayNameFromDateKey(dateKey);

    const payload = {
      user: req.userId,
      date: getDateFromDateKey(dateKey),
      dateKey,
      dayName,
      workoutCompleted: Boolean(workoutCompleted),
      mealsFollowed: Boolean(mealsFollowed),
      weightKg: weightKg === null || weightKg === undefined || weightKg === "" ? null : Number(weightKg),
      waterLiters:
        waterLiters === null || waterLiters === undefined || waterLiters === ""
          ? null
          : Number(waterLiters),
      notes: notes || "",
    };

    const log = await Log.findOneAndUpdate(
      { user: req.userId, dateKey },
      payload,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json(serializeLog(log));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/logs
export const getLogs = async (req, res) => {
  const logs = await Log.find({ user: req.userId }).sort({ date: 1 });
  res.json(logs.map(serializeLog));
};
