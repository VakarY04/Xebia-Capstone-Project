import { useEffect, useState } from "react";
import api from "../api/axios.js";
import DashboardLayout from "../components/DashboardLayout.jsx";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const experienceOptions = ["beginner", "intermediate", "advanced"];
const goalOptions = ["lose_fat", "build_muscle", "get_stronger", "all", "other"];

const goalLabel = {
  lose_fat: "Lose Fat",
  build_muscle: "Build Muscle",
  get_stronger: "Get Stronger",
  all: "A Bit of Everything",
  other: "Other",
};

const MyDetails = () => {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    api.get("/users/me").then((res) => setForm(res.data));
  }, []);

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      await api.put("/users/onboarding", {
        gender: form.gender,
        age: Number(form.age),
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        experienceLevel: form.experienceLevel,
        goal: form.goal,
        injuriesOrConditions: form.injuriesOrConditions,
        availableDays: form.availableDays,
        workoutLocation: form.workoutLocation,
      });
      setSavedMsg(
        "Saved! Your plan will update to reflect these changes next time you visit the Dashboard."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Loading your details...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-white mb-1">My Details</h2>
      <p className="text-slate-400 mb-8 text-sm">
        Update your info any time — your AI plan will adapt to it.
      </p>

      {savedMsg && (
        <p className="text-primary text-sm mb-6 bg-primary/10 p-3 rounded-lg">
          {savedMsg}
        </p>
      )}

      <div className="max-w-2xl flex flex-col gap-8">
        {/* Gender */}
        <section>
          <p className="text-slate-400 text-sm mb-2">Gender</p>
          <div className="flex gap-3">
            {["male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => setForm({ ...form, gender: g })}
                className={`px-6 py-2 rounded-full border-2 capitalize text-sm transition ${
                  form.gender === g
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/20 text-slate-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </section>

        {/* Body stats */}
        <section className="grid grid-cols-3 gap-4">
          {[
            { key: "age", label: "Age" },
            { key: "heightCm", label: "Height (cm)" },
            { key: "weightKg", label: "Weight (kg)" },
          ].map((f) => (
            <div key={f.key}>
              <p className="text-slate-400 text-sm mb-2">{f.label}</p>
              <input
                type="number"
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </section>

        {/* Experience */}
        <section>
          <p className="text-slate-400 text-sm mb-2">Experience level</p>
          <div className="flex gap-3 flex-wrap">
            {experienceOptions.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setForm({ ...form, experienceLevel: lvl })}
                className={`px-5 py-2 rounded-full border-2 capitalize text-sm transition ${
                  form.experienceLevel === lvl
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/20 text-slate-300"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </section>

        {/* Goal */}
        <section>
          <p className="text-slate-400 text-sm mb-2">Goal</p>
          <div className="flex gap-3 flex-wrap">
            {goalOptions.map((g) => (
              <button
                key={g}
                onClick={() => setForm({ ...form, goal: g })}
                className={`px-5 py-2 rounded-full border-2 text-sm transition ${
                  form.goal === g
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/20 text-slate-300"
                }`}
              >
                {goalLabel[g]}
              </button>
            ))}
          </div>
        </section>

        {/* Injuries */}
        <section>
          <p className="text-slate-400 text-sm mb-2">
            Pain / injuries / conditions
          </p>
          <textarea
            rows={3}
            value={form.injuriesOrConditions}
            onChange={(e) =>
              setForm({ ...form, injuriesOrConditions: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </section>

        {/* Available days */}
        <section>
          <p className="text-slate-400 text-sm mb-2">Available days</p>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-full text-sm border-2 transition ${
                  form.availableDays.includes(day)
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/20 text-slate-300"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </section>

        {/* Location */}
        <section>
          <p className="text-slate-400 text-sm mb-2">Workout location</p>
          <div className="flex gap-3">
            {[
              { value: "gym", label: "🏋️ Gym" },
              { value: "home", label: "🏠 Home" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, workoutLocation: opt.value })}
                className={`px-5 py-2 rounded-full border-2 text-sm transition ${
                  form.workoutLocation === opt.value
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/20 text-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-full transition w-fit"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default MyDetails;
