import fetch from "node-fetch";
import User from "../models/User.js";
import Plan from "../models/Plan.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

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

const normalizeStartDate = (value) => {
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

const getScheduleDays = (startDate, totalWeeks) => {
  const start = new Date(`${startDate}T12:00:00Z`);
  const totalDays = totalWeeks * 7;

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);

    const dateKey = date.toISOString().slice(0, 10);
    const dayName = weekdayNames[date.getUTCDay()];

    return {
      dayName,
      dateKey,
      weekNumber: Math.floor(index / 7) + 1,
      dayIndex: index,
      dateLabel: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
    };
  });
};

const buildWeeklyAvailabilitySummary = (weeklyAvailability = []) =>
  weeklyAvailability.length
    ? weeklyAvailability
        .map(
          (week) =>
            `Week ${week.weekNumber}: ${week.days?.length ? week.days.join(", ") : "rest-focused"}`
        )
        .join("; ")
    : "same schedule every week";

const buildPrompt = (user, totalWeeks, scheduleDays) => `
You are a certified personal trainer and nutrition coach. Create a ${totalWeeks}-week workout and meal plan
for this person based on their profile below. Respond with ONLY valid JSON, no markdown fences,
no extra commentary - just the raw JSON object matching the exact schema below.

PROFILE:
- Gender: ${user.gender}
- Age: ${user.age}
- Height: ${user.heightCm} cm
- Weight: ${user.weightKg} kg
- Experience level: ${user.experienceLevel}
- Goal: ${user.goal}
- Injuries/conditions to work around: ${user.injuriesOrConditions || "none"}
- General days available to work out: ${user.availableDays.join(", ") || "none"}
- Week-by-week availability: ${buildWeeklyAvailabilitySummary(user.weeklyAvailability || [])}
- Workout location: ${user.workoutLocation} (${user.workoutLocation === "home"
    ? "assume bodyweight and minimal/no equipment"
    : "assume full gym equipment access"})

SCHEDULE TO COVER IN THIS EXACT ORDER:
${scheduleDays
    .map(
      (day, index) =>
        `${index + 1}. ${day.dateKey} (${day.dayName}) - Week ${day.weekNumber}`
    )
    .join("\n")}

RULES:
- Return exactly ${scheduleDays.length} day entries in the exact order shown above.
- Only schedule normal workout days on dates whose weekday appears in that specific week's availability list. If a date is not available for that week, mark it as a rest or recovery day with lighter training, but still include meals.
- On workout days, tailor exercise selection, volume, and intensity to the experience level and avoid movements that would aggravate any stated injury.
- Meals should support the stated goal.
- Every meal, snack, and daily total must include realistic calories, protein (g), carbs (g), and fats (g).
- Keep exercise names realistic and well known.

Respond with EXACTLY this JSON schema (an object with a "days" array of ${scheduleDays.length} items):

{
  "days": [
    {
      "isRestDay": false,
      "workout": {
        "focus": "Chest and Triceps",
        "exercises": [
          { "name": "Bench Press", "sets": 4, "reps": "8-10", "muscleGroup": "Chest" }
        ]
      },
      "meals": {
        "breakfast": { "name": "Oats with banana and peanut butter", "calories": 450, "protein": 20, "carbs": 55, "fats": 15 },
        "lunch": { "name": "Grilled chicken with rice and veggies", "calories": 650, "protein": 45, "carbs": 70, "fats": 18 },
        "dinner": { "name": "Salmon with quinoa", "calories": 600, "protein": 40, "carbs": 50, "fats": 22 },
        "snacks": [{ "name": "Greek yogurt", "calories": 150, "protein": 15, "carbs": 10, "fats": 4 }]
      },
      "totalCalories": 1850,
      "totalProtein": 120,
      "totalCarbs": 185,
      "totalFats": 59
    }
  ]
}
`;

const decoratePlanDays = (days, scheduleDays) =>
  days.map((day, index) => ({
    ...day,
    day: day.day || scheduleDays[index].dayName,
    dateKey: day.dateKey || scheduleDays[index].dateKey,
    dateLabel: day.dateLabel || scheduleDays[index].dateLabel,
    weekNumber: day.weekNumber || scheduleDays[index].weekNumber,
    dayIndex: day.dayIndex ?? scheduleDays[index].dayIndex,
  }));

const normalizePlanForResponse = (planDoc) => {
  const plan = typeof planDoc.toObject === "function" ? planDoc.toObject() : planDoc;
  const totalWeeks = plan.totalWeeks || Math.max(1, Math.ceil((plan.days?.length || 0) / 7));
  const startDate = plan.startDate || normalizeStartDate(plan.createdAt);
  const scheduleDays = getScheduleDays(startDate, totalWeeks);

  return {
    ...plan,
    totalWeeks,
    startDate,
    days: decoratePlanDays(plan.days || [], scheduleDays),
  };
};

export const generatePlan = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.onboardingComplete) {
      return res.status(400).json({ message: "Please complete onboarding first" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message:
          "GEMINI_API_KEY is missing from backend/.env. Get a free key at https://aistudio.google.com/app/apikey",
      });
    }

    const totalWeeks = Math.min(4, Math.max(1, Number(req.body?.weeks) || 1));
    const startDate = normalizeStartDate(req.body?.startDate);
    const scheduleDays = getScheduleDays(startDate, totalWeeks);
    const prompt = buildPrompt(user, totalWeeks, scheduleDays);

    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(502).json({ message: "AI plan generation failed", detail: data });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(502).json({ message: "AI returned an empty response, please try again" });
    }

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ message: "AI returned invalid JSON, please try again" });
    }

    if (!Array.isArray(parsed.days) || parsed.days.length !== scheduleDays.length) {
      return res.status(502).json({
        message: `AI returned ${parsed.days?.length || 0} days, but ${scheduleDays.length} were required. Please try again.`,
      });
    }

    const plan = await Plan.create({
      user: user._id,
      totalWeeks,
      startDate,
      days: decoratePlanDays(parsed.days, scheduleDays),
      generatedFrom: {
        gender: user.gender,
        age: user.age,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        experienceLevel: user.experienceLevel,
        goal: user.goal,
        injuriesOrConditions: user.injuriesOrConditions,
        availableDays: user.availableDays,
        weeklyAvailability: user.weeklyAvailability,
        workoutLocation: user.workoutLocation,
      },
    });

    res.status(201).json(normalizePlanForResponse(plan));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getLatestPlan = async (req, res) => {
  const plan = await Plan.findOne({ user: req.userId }).sort({ createdAt: -1 });
  if (!plan) return res.status(404).json({ message: "No plan yet" });
  res.json(normalizePlanForResponse(plan));
};
