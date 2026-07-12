import mongoose from "mongoose";

// One document per calendar date the user logs.
// `dateKey` keeps the chosen day stable across time zones and charts.
const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, default: Date.now },
    dateKey: { type: String, required: true },
    dayName: { type: String, required: true },
    workoutCompleted: { type: Boolean, default: false },
    mealsFollowed: { type: Boolean, default: false },
    weightKg: { type: Number, default: null },
    waterLiters: { type: Number, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

logSchema.index({ user: 1, dateKey: 1 }, { unique: true });

const Log = mongoose.model("Log", logSchema);
export default Log;
