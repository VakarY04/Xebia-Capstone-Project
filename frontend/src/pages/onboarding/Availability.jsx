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
      prev.includes(day) ? prev.filter((entry) => entry !== day) : [...prev, day]
    );
  };

  const handleFinish = async () => {
    if (selectedDays.length === 0 || !location) return;
    setLoading(true);
    try {
      const weeklyAvailability = [1, 2, 3, 4].map((weekNumber) => ({
        weekNumber,
        days: [...selectedDays],
      }));

      await api.put("/users/onboarding", {
        injuriesOrConditions: injuries,
        availableDays: selectedDays,
        weeklyAvailability,
        workoutLocation: location,
        onboardingComplete: true,
      });
      updateUser({ onboardingComplete: true, availableDays: selectedDays, weeklyAvailability });
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
        <label className="text-slate-300 text-sm mb-2 block font-medium">
          Any pain, injuries, or medical conditions we should know about?
          (optional)
        </label>
        <textarea
          value={injuries}
          onChange={(e) => setInjuries(e.target.value)}
          placeholder="e.g. lower back pain, knee injury, asthma..."
          rows={3}
          className="w-full px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-slate-400 outline-none transition hover:-translate-y-0.5 hover:bg-white/15 focus:ring-4 focus:ring-primary/20 resize-none"
        />
      </div>

      <div className="w-full max-w-lg mb-6">
        <p className="text-slate-300 text-sm mb-3 font-medium">
          Which days can you usually work out?
        </p>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-4 py-2 rounded-full text-sm border-2 font-medium transition-all duration-200 hover:-translate-y-1 ${
                selectedDays.includes(day)
                  ? "border-primary bg-primary/20 text-white shadow-md shadow-primary/20"
                  : "border-white/20 bg-white/5 text-slate-200 hover:border-white/40"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          You can fine-tune different workout days for weeks 1 to 4 later in My Details.
        </p>
      </div>

      <div className="w-full max-w-lg mb-10">
        <p className="text-slate-300 text-sm mb-3 font-medium">
          Where do you work out?
        </p>
        <div className="flex gap-4">
          {[
            { value: "gym", label: "Gym" },
            { value: "home", label: "Home" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLocation(opt.value)}
              className={`flex-1 px-5 py-4 rounded-2xl border-2 text-white font-medium transition-all duration-200 hover:-translate-y-1 ${
                location === opt.value
                  ? "border-primary bg-primary/20 shadow-md shadow-primary/20"
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
        className="bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-semibold px-10 py-3 rounded-full transition-all duration-200 hover:-translate-y-1"
      >
        {loading ? "Setting things up..." : "Finish and See My Plan"}
      </button>
    </div>
  );
};

export default Availability;
