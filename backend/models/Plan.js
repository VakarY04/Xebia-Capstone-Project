import mongoose from "mongoose";

// One document stores the latest generated plan for a user.
// The `days` array can cover 1-4 weeks and stays flexible because
// the AI response contains nested workout/meal JSON.
const planSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalWeeks: { type: Number, required: true, default: 1, min: 1, max: 4 },
    startDate: { type: String, required: true },
    days: { type: mongoose.Schema.Types.Mixed, required: true },
    generatedFrom: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
