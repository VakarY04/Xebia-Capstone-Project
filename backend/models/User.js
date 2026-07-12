import mongoose from "mongoose";

const weeklyAvailabilitySchema = new mongoose.Schema(
  {
    weekNumber: { type: Number, required: true, min: 1, max: 4 },
    days: { type: [String], default: [] },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    onboardingComplete: { type: Boolean, default: false },
    gender: { type: String, enum: ["male", "female"], default: null },
    age: { type: Number, default: null },
    heightCm: { type: Number, default: null },
    weightKg: { type: Number, default: null },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: null,
    },
    goal: {
      type: String,
      enum: ["lose_fat", "build_muscle", "get_stronger", "all", "other"],
      default: null,
    },
    injuriesOrConditions: { type: String, default: "" },
    availableDays: {
      type: [String],
      default: [],
    },
    weeklyAvailability: {
      type: [weeklyAvailabilitySchema],
      default: [],
    },
    workoutLocation: {
      type: String,
      enum: ["gym", "home"],
      default: null,
    },
    avatar: { type: String, default: "" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
