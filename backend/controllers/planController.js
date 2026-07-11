import fetch from "node-fetch";
import User from "../models/User.js";
import Plan from "../models/Plan.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const buildPrompt = (user) => `
You are a certified personal trainer and nutrition coach. Create a 7-day workout and meal plan
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
- Days available to work out: ${user.availableDays.join(", ")}
- Workout location: ${user.workoutLocation} (${
  user.workoutLocation === "home"
    ? "assume bodyweight and minimal/no equipment"
    : "assume full gym equipment access"
})

RULES:
- Cover all 7 days (Monday through Sunday). On days NOT in the available days list, mark it as a rest/recovery day with light meals still planned.
- On workout days, tailor exercise selection, volume and intensity to the experience level and avoid movements that would aggravate any stated injury.
- Meals should roughly support the stated goal (e.g. calorie deficit for lose_fat, calorie surplus + higher protein for build_muscle).
- Keep exercise names realistic and well known.

Respond with EXACTLY this JSON schema (an object with a "days" array of 7 items):

{
  "days": [
    {
      "day": "Monday",
      "isRestDay": false,
      "workout": {
        "focus": "Chest & Triceps",
        "exercises": [
          { "name": "Bench Press", "sets": 4, "reps": "8-10", "muscleGroup": "Chest" }
        ]
      },
      "meals": {
        "breakfast": { "name": "Oats with banana and peanut butter", "calories": 450, "protein": 20 },
        "lunch": { "name": "Grilled chicken with rice and veggies", "calories": 650, "protein": 45 },
        "dinner": { "name": "Salmon with quinoa", "calories": 600, "protein": 40 },
        "snacks": [{ "name": "Greek yogurt", "calories": 150, "protein": 15 }]
      },
      "totalCalories": 1850,
      "totalProtein": 120
    }
  ]
}
`;

// @route POST /api/plans/generate
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

    const prompt = buildPrompt(user);

    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
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
      // Strip markdown fences just in case the model adds them anyway
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return res.status(502).json({ message: "AI returned invalid JSON, please try again" });
    }

    const plan = await Plan.create({
      user: user._id,
      days: parsed.days,
      generatedFrom: {
        gender: user.gender,
        age: user.age,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        experienceLevel: user.experienceLevel,
        goal: user.goal,
        injuriesOrConditions: user.injuriesOrConditions,
        availableDays: user.availableDays,
        workoutLocation: user.workoutLocation,
      },
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/plans/latest
export const getLatestPlan = async (req, res) => {
  const plan = await Plan.findOne({ user: req.userId }).sort({ createdAt: -1 });
  if (!plan) return res.status(404).json({ message: "No plan yet" });
  res.json(plan);
};
