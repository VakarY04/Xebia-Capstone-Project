import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    // Tracks whether the user has completed the onboarding flow
    onboardingComplete: { type: Boolean, default: false },

    // ---- Onboarding Step 1 ----
    gender: { type: String, enum: ["male", "female"], default: null },

    // ---- Onboarding Step 2 ----
    age: { type: Number, default: null },
    heightCm: { type: Number, default: null },
    weightKg: { type: Number, default: null },

    // ---- Onboarding Step 3 ----
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

    // ---- Onboarding Step 4 ----
    injuriesOrConditions: { type: String, default: "" }, // free text, e.g. "knee pain"
    availableDays: {
      type: [String], // e.g. ["Monday", "Wednesday", "Friday"]
      default: [],
    },
    workoutLocation: {
      type: String,
      enum: ["gym", "home"],
      default: null,
    },

    // ---- Profile ----
    avatar: { type: String, default: "" }, // base64 data URL of a small profile picture

    // ---- Password reset ----
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
