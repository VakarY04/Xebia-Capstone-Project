import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import OnboardingProgress from "../../components/OnboardingProgress.jsx";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Availability = () => {
  const [injuries, setInjuries] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleFinish = async () => {
    if (selectedDays.length === 0 || !location) return;
    setLoading(true);
    try {
      await api.put("/users/onboarding", {
        injuriesOrConditions: injuries,
        availableDays: selectedDays,
        workoutLocation: location,
        onboardingComplete: true,
      });
      updateUser({ onboardingComplete: true });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 py-10">
      <OnboardingProgress step={4} />
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Almost there
      </h2>

      <div className="w-full max-w-lg mb-6">
        <label className="text-slate-400 text-sm mb-2 block">
          Any pain, injuries, or medical conditions we should know about?
          (optional)
        </label>
        <textarea
          value={injuries}
          onChange={(e) => setInjuries(e.target.value)}
          placeholder="e.g. lower back pain, knee injury, asthma..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <div className="w-full max-w-lg mb-6">
        <p className="text-slate-400 text-sm mb-3">
          Which days can you work out?
        </p>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-4 py-2 rounded-full text-sm border-2 transition ${
                selectedDays.includes(day)
                  ? "border-primary bg-primary/20 text-white"
                  : "border-white/20 bg-white/5 text-slate-300 hover:border-white/40"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg mb-10">
        <p className="text-slate-400 text-sm mb-3">
          Where do you work out?
        </p>
        <div className="flex gap-4">
          {[
            { value: "gym", label: "🏋️ Gym" },
            { value: "home", label: "🏠 Home" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLocation(opt.value)}
              className={`flex-1 px-5 py-4 rounded-xl border-2 text-white font-medium transition ${
                location === opt.value
                  ? "border-primary bg-primary/20"
                  : "border-white/20 bg-white/5 hover:border-white/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleFinish}
        disabled={selectedDays.length === 0 || !location || loading}
        className="bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-semibold px-10 py-3 rounded-full transition"
      >
        {loading ? "Setting things up..." : "Finish & See My Plan →"}
      </button>
    </div>
  );
};

export default Availability;
