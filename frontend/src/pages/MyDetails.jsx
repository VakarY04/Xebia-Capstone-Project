import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import AppHeader from "../components/AppHeader.jsx";
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
const weekNumbers = [1, 2, 3, 4];

const goalLabel = {
  lose_fat: "Lose Fat",
  build_muscle: "Build Muscle",
  get_stronger: "Get Stronger",
  all: "A Bit of Everything",
  other: "Other",
};

const Pill = ({ selected, children, className = "", ...props }) => (
  <button
    {...props}
    className={`pill-light hover:-translate-y-1 ${selected ? "pill-light-selected" : "pill-light-unselected"} ${className}`}
  >
    {children}
  </button>
);

const buildWeeklyAvailability = (form) => {
  const existingMap = new Map((form.weeklyAvailability || []).map((entry) => [entry.weekNumber, entry.days || []]));
  return weekNumbers.map((weekNumber) => ({
    weekNumber,
    days: existingMap.get(weekNumber) || form.availableDays || [],
  }));
};

const MyDetails = () => {
  const [form, setForm] = useState(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    api.get("/users/me").then((res) => {
      const normalized = {
        ...res.data,
        weeklyAvailability: buildWeeklyAvailability(res.data),
      };
      setForm(normalized);
    });
  }, []);

  const weekSchedule = useMemo(
    () => form?.weeklyAvailability?.find((entry) => entry.weekNumber === activeWeek)?.days || [],
    [activeWeek, form]
  );

  const toggleGlobalDay = (day) => {
    setForm((prev) => {
      const availableDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter((entry) => entry !== day)
        : [...prev.availableDays, day];

      const weeklyAvailability = prev.weeklyAvailability.map((week) => ({
        ...week,
        days: week.days.includes(day)
          ? week.days.filter((entry) => entry !== day)
          : [...week.days, day],
      }));

      return { ...prev, availableDays, weeklyAvailability };
    });
  };

  const toggleWeekDay = (day) => {
    setForm((prev) => {
      const weeklyAvailability = prev.weeklyAvailability.map((week) => {
        if (week.weekNumber !== activeWeek) return week;
        return {
          ...week,
          days: week.days.includes(day)
            ? week.days.filter((entry) => entry !== day)
            : [...week.days, day],
        };
      });

      const availableDays = [...new Set(weeklyAvailability.flatMap((week) => week.days))];
      return { ...prev, weeklyAvailability, availableDays };
    });
  };

  const copyGlobalToAllWeeks = () => {
    setForm((prev) => ({
      ...prev,
      weeklyAvailability: prev.weeklyAvailability.map((week) => ({
        ...week,
        days: [...prev.availableDays],
      })),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      const weeklyAvailability = buildWeeklyAvailability(form);
      const availableDays = [...new Set(weeklyAvailability.flatMap((week) => week.days))];

      const payload = {
        gender: form.gender,
        age: Number(form.age),
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        experienceLevel: form.experienceLevel,
        goal: form.goal,
        injuriesOrConditions: form.injuriesOrConditions,
        availableDays,
        weeklyAvailability,
        workoutLocation: form.workoutLocation,
      };

      const res = await api.put("/users/onboarding", payload);
      setForm({ ...res.data, weeklyAvailability: buildWeeklyAvailability(res.data) });
      setSavedMsg("Saved. Your next generated plan will follow the week-by-week schedule you set here.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center">
          <div className="card-light px-6 py-5 text-sm font-medium text-slate-600">Loading your details...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AppHeader
        title="My Details"
        subtitle="Update the profile fields and the week-by-week workout schedule that drive plan generation."
      />

      {savedMsg ? (
        <p className="mt-6 rounded-[20px] border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
          {savedMsg}
        </p>
      ) : null}

      <div className="mt-6 max-w-5xl card-light p-6">
        <div className="grid gap-8">
          <section>
            <p className="mb-3 text-sm font-semibold text-slate-700">Gender</p>
            <div className="flex flex-wrap gap-3">
              {["male", "female"].map((gender) => (
                <Pill key={gender} selected={form.gender === gender} onClick={() => setForm({ ...form, gender })}>
                  <span className="capitalize">{gender}</span>
                </Pill>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              { key: "age", label: "Age" },
              { key: "heightCm", label: "Height (cm)" },
              { key: "weightKg", label: "Weight (kg)" },
            ].map((field) => (
              <div key={field.key}>
                <p className="mb-2 text-sm font-semibold text-slate-700">{field.label}</p>
                <input
                  type="number"
                  value={form[field.key] ?? ""}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  className="input-field-light w-full px-4 py-3 hover:-translate-y-0.5"
                />
              </div>
            ))}
          </section>

          <section>
            <p className="mb-3 text-sm font-semibold text-slate-700">Experience level</p>
            <div className="flex flex-wrap gap-3">
              {experienceOptions.map((level) => (
                <Pill key={level} selected={form.experienceLevel === level} onClick={() => setForm({ ...form, experienceLevel: level })}>
                  <span className="capitalize">{level}</span>
                </Pill>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-sm font-semibold text-slate-700">Goal</p>
            <div className="flex flex-wrap gap-3">
              {goalOptions.map((goal) => (
                <Pill key={goal} selected={form.goal === goal} onClick={() => setForm({ ...form, goal })}>
                  {goalLabel[goal]}
                </Pill>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-sm font-semibold text-slate-700">Pain, injuries, or conditions</p>
            <textarea
              rows={4}
              value={form.injuriesOrConditions}
              onChange={(event) => setForm({ ...form, injuriesOrConditions: event.target.value })}
              className="input-field-light w-full resize-none px-4 py-3 hover:-translate-y-0.5"
            />
          </section>

          <section className="app-subtle-panel p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">General workout days</p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  These are your common training days. You can override them for each week below.
                </p>
              </div>
              <button type="button" onClick={copyGlobalToAllWeeks} className="btn-primary">
                Copy to all 4 weeks
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {days.map((day) => (
                <Pill key={day} selected={form.availableDays.includes(day)} onClick={() => toggleGlobalDay(day)}>
                  {day.slice(0, 3)}
                </Pill>
              ))}
            </div>
          </section>

          <section className="app-subtle-panel p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Week-by-week schedule</p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  Set different workout days for busy weeks so the generated plan matches your real availability.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {weekNumbers.map((weekNumber) => (
                  <Pill
                    key={weekNumber}
                    selected={activeWeek === weekNumber}
                    onClick={() => setActiveWeek(weekNumber)}
                  >
                    Week {weekNumber}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {weekNumbers.map((weekNumber) => {
                const weekDays = form.weeklyAvailability.find((entry) => entry.weekNumber === weekNumber)?.days || [];
                return (
                  <div
                    key={weekNumber}
                    className={`rounded-[18px] border bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                      activeWeek === weekNumber ? "border-primary shadow-md shadow-primary/10" : "border-slate-200"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900">Week {weekNumber}</p>
                    <p className="mt-2 text-xs font-medium text-slate-600 min-h-[2.5rem]">
                      {weekDays.length ? weekDays.join(", ") : "No workout days selected yet"}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {days.map((day) => (
                <Pill key={`${activeWeek}-${day}`} selected={weekSchedule.includes(day)} onClick={() => toggleWeekDay(day)}>
                  {day.slice(0, 3)}
                </Pill>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-sm font-semibold text-slate-700">Workout location</p>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "gym", label: "Gym" },
                { value: "home", label: "Home" },
              ].map((option) => (
                <Pill
                  key={option.value}
                  selected={form.workoutLocation === option.value}
                  onClick={() => setForm({ ...form, workoutLocation: option.value })}
                >
                  {option.label}
                </Pill>
              ))}
            </div>
          </section>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-fit">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyDetails;
