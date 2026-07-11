import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import OnboardingProgress from "../../components/OnboardingProgress.jsx";

const BodyStats = () => {
  const [form, setForm] = useState({ age: "", heightCm: "", weightKg: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContinue = async () => {
    if (!form.age || !form.heightCm || !form.weightKg) {
      setError("Please fill in all three fields");
      return;
    }
    await api.put("/users/onboarding", {
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
    });
    navigate("/onboarding/experience");
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4">
      <OnboardingProgress step={2} />
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Tell us about your body
      </h2>

      {error && (
        <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-2 rounded">
          {error}
        </p>
      )}

      <div className="w-full max-w-sm flex flex-col gap-4 mb-10">
        <div>
          <label className="text-slate-400 text-sm mb-1 block">Age</label>
          <input
            name="age"
            type="number"
            min="10"
            max="100"
            placeholder="e.g. 22"
            value={form.age}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-slate-400 text-sm mb-1 block">
            Height (cm)
          </label>
          <input
            name="heightCm"
            type="number"
            min="100"
            max="250"
            placeholder="e.g. 175"
            value={form.heightCm}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-slate-400 text-sm mb-1 block">
            Weight (kg)
          </label>
          <input
            name="weightKg"
            type="number"
            min="30"
            max="300"
            placeholder="e.g. 70"
            value={form.weightKg}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-3 rounded-full transition"
      >
        Continue
      </button>
    </div>
  );
};

export default BodyStats;
