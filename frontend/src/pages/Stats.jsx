import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios.js";
import AppHeader from "../components/AppHeader.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";
import {
  formatDateLabel,
  getDefaultActiveDayKey,
  getDefaultActiveWeek,
  getDayNameFromDateKey,
  getLogDateKey,
  getTodayDateKey,
  groupPlanWeeks,
} from "../utils/planDates.js";

const buildDailyLogSummary = (logs) => {
  const grouped = new Map();

  logs.forEach((log) => {
    const dateKey = getLogDateKey(log);
    const current = grouped.get(dateKey) || {
      ...log,
      dateKey,
      workoutCompleted: false,
      mealsFollowed: false,
      waterLiters: 0,
    };

    current.workoutCompleted = current.workoutCompleted || Boolean(log.workoutCompleted);
    current.mealsFollowed = current.mealsFollowed || Boolean(log.mealsFollowed);
    current.waterLiters += Number(log.waterLiters || 0);
    if (log.weightKg !== null && log.weightKg !== undefined && log.weightKg !== "") {
      current.weightKg = Number(log.weightKg);
    }

    grouped.set(dateKey, current);
  });

  return [...grouped.values()].sort((a, b) => a.dateKey.localeCompare(b.dateKey));
};

const Stats = () => {
  const [plan, setPlan] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDateKey, setSelectedDateKey] = useState(getTodayDateKey());
  const [form, setForm] = useState({
    workoutCompleted: true,
    mealsFollowed: true,
    weightKg: "",
    waterLiters: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const [planRes, logsRes] = await Promise.allSettled([
      api.get("/plans/latest"),
      api.get("/logs"),
    ]);

    if (planRes.status === "fulfilled") {
      const nextPlan = planRes.value.data;
      setPlan(nextPlan);
      setSelectedWeek(getDefaultActiveWeek(nextPlan));
      setSelectedDateKey(getDefaultActiveDayKey(nextPlan));
    }

    if (logsRes.status === "fulfilled") {
      setLogs(logsRes.value.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const summarizedLogs = useMemo(() => buildDailyLogSummary(logs), [logs]);
  const planWeeks = useMemo(() => groupPlanWeeks(plan), [plan]);
  const currentWeekDays =
    planWeeks.find((week) => week.weekNumber === selectedWeek)?.days || [];
  const selectedPlanDay = plan?.days?.find((day) => day.dateKey === selectedDateKey);

  const handleLogSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        date: selectedDateKey,
        dayName: getDayNameFromDateKey(selectedDateKey),
        weightKg: form.weightKg ? Number(form.weightKg) : null,
        waterLiters: form.waterLiters ? Number(form.waterLiters) : null,
      };

      const res = await api.post("/logs", payload);
      setLogs((prev) => {
        const next = prev.filter((log) => getLogDateKey(log) !== res.data.dateKey);
        return [...next, res.data];
      });
      setForm((prev) => ({ ...prev, weightKg: "", waterLiters: "", notes: "" }));
    } finally {
      setSaving(false);
    }
  };

  const adherence = useMemo(() => {
    if (summarizedLogs.length === 0) return 0;
    const completed = summarizedLogs.filter((log) => log.workoutCompleted).length;
    return Math.round((completed / summarizedLogs.length) * 100);
  }, [summarizedLogs]);

  const weightData = useMemo(
    () =>
      summarizedLogs
        .filter((log) => log.weightKg)
        .map((log) => ({
          date: formatDateLabel(log.dateKey, { month: "short", day: "numeric" }),
          weight: log.weightKg,
        })),
    [summarizedLogs]
  );

  const muscleGroupData = useMemo(() => {
    if (currentWeekDays.length === 0) return [];
    const counts = {};
    currentWeekDays.forEach((day) => {
      day.workout?.exercises?.forEach((exercise) => {
        const group = exercise.muscleGroup || "Other";
        counts[group] = (counts[group] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([group, count]) => ({ group, count }));
  }, [currentWeekDays]);

  const nutritionData = useMemo(() => {
    if (currentWeekDays.length === 0) return [];
    return currentWeekDays.map((day) => ({
      day: `${day.day.slice(0, 3)} ${formatDateLabel(day.dateKey, { day: "numeric" })}`,
      calories: day.totalCalories || 0,
      protein: day.totalProtein || 0,
      carbs: day.totalCarbs || 0,
      fats: day.totalFats || 0,
    }));
  }, [currentWeekDays]);

  const axisColor = "#64748b";
  const gridColor = "#dbe4f0";
  const tooltipStyle = {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: 18,
    color: "#0f172a",
  };

  return (
    <DashboardLayout>
      <AppHeader
        title="Stats"
        subtitle="Log exact plan dates and review how training and nutrition shift across the generated weeks."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="card-light p-6">
          <p className="text-sm font-semibold text-slate-600">Adherence</p>
          <p className="mt-3 text-3xl font-semibold text-primary">{adherence}%</p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {summarizedLogs.length} logged day{summarizedLogs.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="card-light p-6">
          <p className="text-sm font-semibold text-slate-600">Latest weight</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {weightData.length ? `${weightData[weightData.length - 1].weight} kg` : "-"}
          </p>
          <p className="mt-2 text-sm font-medium text-slate-600">From your most recent check-in</p>
        </div>
        <div className="card-light p-6">
          <p className="text-sm font-semibold text-slate-600">Plan status</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {plan ? `${plan.totalWeeks} week${plan.totalWeeks === 1 ? "" : "s"}` : "No plan"}
          </p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {plan ? `Starting ${plan.startDate}` : "Generate one on Workout and Meals"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="app-grid-panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="app-section-title">Daily Log</h2>
              <p className="app-section-subtitle">Choose the exact plan date you completed so charts land in the correct day column.</p>
            </div>
            {planWeeks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {planWeeks.map((week) => (
                  <button
                    key={week.weekNumber}
                    type="button"
                    onClick={() => {
                      setSelectedWeek(week.weekNumber);
                      setSelectedDateKey(week.days[0]?.dateKey || selectedDateKey);
                    }}
                    className={`pill-light ${
                      selectedWeek === week.weekNumber ? "pill-light-selected" : "pill-light-unselected"
                    }`}
                  >
                    Week {week.weekNumber}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form onSubmit={handleLogSubmit} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Plan date</label>
              {currentWeekDays.length > 0 ? (
                <select
                  value={selectedDateKey}
                  onChange={(event) => setSelectedDateKey(event.target.value)}
                  className="input-field-light w-full px-4 py-3"
                >
                  {currentWeekDays.map((day) => (
                    <option key={day.dateKey} value={day.dateKey}>
                      {day.day} - {formatDateLabel(day.dateKey, { month: "short", day: "numeric" })}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="date"
                  value={selectedDateKey}
                  onChange={(event) => setSelectedDateKey(event.target.value)}
                  className="input-field-light w-full px-4 py-3"
                />
              )}
            </div>

            <div className="rounded-[26px] bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 md:col-span-1 xl:col-span-2">
              {selectedPlanDay
                ? `Logging ${selectedPlanDay.day}, ${formatDateLabel(selectedPlanDay.dateKey, { month: "long", day: "numeric" })}. ${selectedPlanDay.isRestDay ? "This is a planned recovery day." : `Workout focus: ${selectedPlanDay.workout?.focus || "Active session"}.`}`
                : "Choose a date or generate a plan to align your logs with the calendar."}
            </div>

            <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.workoutCompleted}
                onChange={(event) => setForm({ ...form, workoutCompleted: event.target.checked })}
              />
              Workout done
            </label>

            <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.mealsFollowed}
                onChange={(event) => setForm({ ...form, mealsFollowed: event.target.checked })}
              />
              Meals followed
            </label>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Weight (kg)</label>
              <input
                type="number"
                value={form.weightKg}
                onChange={(event) => setForm({ ...form, weightKg: event.target.value })}
                className="input-field-light w-full px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Water (L)</label>
              <input
                type="number"
                step="0.1"
                value={form.waterLiters}
                onChange={(event) => setForm({ ...form, waterLiters: event.target.value })}
                className="input-field-light w-full px-4 py-3"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Notes</label>
              <textarea
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                rows={3}
                className="input-field-light w-full resize-none px-4 py-3"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save or Update Log"}
              </button>
            </div>
          </form>
        </section>

        {weightData.length > 0 ? (
          <section className="app-grid-panel">
            <h2 className="app-section-title">Weight Trend</h2>
            <p className="app-section-subtitle">Body-weight check-ins across your logged dates.</p>
            <div className="mt-6 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} kg`, "Weight"]} />
                  <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {muscleGroupData.length > 0 ? (
          <section className="app-grid-panel">
            <h2 className="app-section-title">Muscle Groups Worked</h2>
            <p className="app-section-subtitle">Exercise distribution for the selected plan week.</p>
            <div className="mt-6 h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={muscleGroupData}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="group" stroke={axisColor} fontSize={12} interval={0} angle={-12} textAnchor="end" height={60} />
                  <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} exercise${value !== 1 ? "s" : ""}`, "Count"]}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}

        {nutritionData.length > 0 ? (
          <section className={`app-grid-panel ${muscleGroupData.length === 0 ? "xl:col-span-2" : ""}`}>
            <h2 className="app-section-title">Calories and Macros by Day</h2>
            <p className="app-section-subtitle">Week-specific nutrition targets for calories, protein, carbs, and fats.</p>
            <div className="mt-6 h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke={axisColor} fontSize={12} interval={0} angle={-10} textAnchor="end" height={55} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => {
                      const labels = {
                        calories: "Calories",
                        protein: "Protein",
                        carbs: "Carbs",
                        fats: "Fats",
                      };
                      const units = name === "calories" ? "kcal" : "g";
                      return [`${value} ${units}`, labels[name] || name];
                    }}
                  />
                  <Bar dataKey="calories" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="protein" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="carbs" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="fats" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Stats;

