import mongoose from "mongoose";

// One document = one full 7-day plan for a user.
// We keep it flexible (Mixed) since the AI output structure is JSON
// generated dynamically - this is the kind of flexible data MongoDB is good at.
const planSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    days: { type: mongoose.Schema.Types.Mixed, required: true },
    // days will look like:
    // [
    //   { day: "Monday", workout: { focus: "Chest & Triceps", exercises: [...] },
    //     meals: { breakfast: {...}, lunch: {...}, dinner: {...}, snacks: [...] },
    //     totalCalories: 2200, totalProtein: 140 },
    //   ... x7
    // ]
    generatedFrom: { type: mongoose.Schema.Types.Mixed }, // snapshot of onboarding answers used
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
