import mongoose from "mongoose";

// One document per day the user logs. Used to build the Stats page:
// adherence, weight trend, and (combined with the Plan) calories/protein/muscle focus.
const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, default: Date.now },
    dayName: { type: String, required: true }, // "Monday", etc - matches plan day
    workoutCompleted: { type: Boolean, default: false },
    mealsFollowed: { type: Boolean, default: false },
    weightKg: { type: Number, default: null }, // optional body weight check-in
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logSchema);
export default Log;
