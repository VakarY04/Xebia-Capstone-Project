import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import OnboardingProgress from "../../components/OnboardingProgress.jsx";

const experienceOptions = [
  { value: "beginner", label: "Beginner", desc: "New to structured training" },
  { value: "intermediate", label: "Intermediate", desc: "6+ months experience" },
  { value: "advanced", label: "Advanced", desc: "2+ years experience" },
];

const goalOptions = [
  { value: "lose_fat", label: "Lose Fat" },
  { value: "build_muscle", label: "Build Muscle" },
  { value: "get_stronger", label: "Get Stronger" },
  { value: "all", label: "A Bit of Everything" },
  { value: "other", label: "Other" },
];

const Experience = () => {
  const [experienceLevel, setExperienceLevel] = useState(null);
  const [goal, setGoal] = useState(null);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!experienceLevel || !goal) return;
    await api.put("/users/onboarding", { experienceLevel, goal });
    navigate("/onboarding/availability");
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 py-10">
      <OnboardingProgress step={3} />
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Your experience & goal
      </h2>

      <div className="w-full max-w-lg mb-8">
        <p className="text-slate-400 text-sm mb-3">
          What's your experience level?
        </p>
        <div className="flex flex-col gap-3">
          {experienceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setExperienceLevel(opt.value)}
              className={`text-left px-5 py-4 rounded-xl border-2 transition ${
                experienceLevel === opt.value
                  ? "border-primary bg-primary/20"
                  : "border-white/20 bg-white/5 hover:border-white/40"
              }`}
            >
              <p className="text-white font-semibold">{opt.label}</p>
              <p className="text-slate-400 text-sm">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg mb-10">
        <p className="text-slate-400 text-sm mb-3">
          What are you working towards?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGoal(opt.value)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition ${
                goal === opt.value
                  ? "border-primary bg-primary/20 text-white"
                  : "border-white/20 bg-white/5 text-slate-300 hover:border-white/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!experienceLevel || !goal}
        className="bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-semibold px-10 py-3 rounded-full transition"
      >
        Continue
      </button>
    </div>
  );
};

export default Experience;
