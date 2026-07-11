import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import OnboardingProgress from "../../components/OnboardingProgress.jsx";

const Gender = () => {
  const [gender, setGender] = useState(null);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!gender) return;
    await api.put("/users/onboarding", { gender });
    navigate("/onboarding/body-stats");
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4">
      <OnboardingProgress step={1} />
      <h2 className="text-3xl font-bold text-white mb-8">
        Which gender are you?
      </h2>

      <div className="flex gap-6 mb-10">
        {["male", "female"].map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`px-10 py-6 rounded-2xl border-2 text-white text-lg capitalize transition ${
              gender === g
                ? "border-primary bg-primary/20"
                : "border-white/20 bg-white/5 hover:border-white/40"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!gender}
        className="bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-semibold px-10 py-3 rounded-full transition"
      >
        Continue
      </button>
    </div>
  );
};

export default Gender;
