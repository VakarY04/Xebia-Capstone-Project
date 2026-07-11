import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios.js";
import DashboardLayout from "../components/DashboardLayout.jsx";

const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Stats = () => {
  const [plan, setPlan] = useState(null);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    dayName: "Monday",
    workoutCompleted: true,
    mealsFollowed: true,
    weightKg: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const [planRes, logsRes] = await Promise.allSettled([
      api.get("/plans/latest"),
      api.get("/logs"),
    ]);
    if (planRes.status === "fulfilled") setPlan(planRes.value.data);
    if (logsRes.status === "fulfilled") setLogs(logsRes.value.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/logs", {
        ...form,
        weightKg: form.weightKg ? Number(form.weightKg) : null,
      });
      setLogs((prev) => [...prev, res.data]);
      setForm({ ...form, weightKg: "", notes: "" });
    } finally {
      setSaving(false);
    }
  };

  // Adherence %
  const adherence = useMemo(() => {
    if (logs.length === 0) return 0;
    const completed = logs.filter((l) => l.workoutCompleted).length;
    return Math.round((completed / logs.length) * 100);
  }, [logs]);

  // Weight trend data for LineChart
  const weightData = useMemo(
    () =>
      logs
        .filter((l) => l.weightKg)
        .map((l) => ({
          date: new Date(l.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          weight: l.weightKg,
        })),
    [logs]
  );

  // Muscle group focus from the AI plan
  const muscleGroupData = useMemo(() => {
    if (!plan) return [];
    const counts = {};
    plan.days.forEach((d) => {
      d.workout?.exercises?.forEach((ex) => {
        const group = ex.muscleGroup || "Other";
        counts[group] = (counts[group] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([group, count]) => ({ group, count }));
  }, [plan]);

  // Calories/protein per day from the AI plan
  const nutritionData = useMemo(() => {
    if (!plan) return [];
    return dayOrder.map((day) => {
      const d = plan.days.find((x) => x.day === day);
      return {
        day: day.slice(0, 3),
        calories: d?.totalCalories || 0,
        protein: d?.totalProtein || 0,
      };
    });
  }, [plan]);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-white mb-1">Stats</h2>
      <p className="text-slate-400 mb-8 text-sm">
        Log your progress and see how you're tracking against your plan.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="interactive-card bg-dark-card border border-white/10 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Adherence</p>
          <p className="text-3xl font-bold text-primary">{adherence}%</p>
          <p className="text-slate-500 text-xs mt-1">
            {logs.length} day{logs.length !== 1 ? "s" : ""} logged &middot; % of logged days you completed your workout
          </p>
        </div>
        <div className="interactive-card bg-dark-card border border-white/10 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Latest weight</p>
          <p className="text-3xl font-bold text-white">
            {weightData.length
              ? `${weightData[weightData.length - 1].weight} kg`
              : "—"}
          </p>
          <p className="text-slate-500 text-xs mt-1">From your most recent check-in</p>
        </div>
        <div className="interactive-card bg-dark-card border border-white/10 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Plan status</p>
          <p className="text-3xl font-bold text-white">
            {plan ? "Active" : "No plan"}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            {plan ? "Your 7-day plan is live" : "Generate one on the Dashboard"}
          </p>
        </div>
      </div>

      {/* Log entry form */}
      <div className="bg-dark-card border border-white/10 rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold mb-4">Log Today</h3>
        <form
          onSubmit={handleLogSubmit}
          className="flex flex-wrap items-end gap-4"
        >
          <div>
            <label className="text-slate-400 text-xs block mb-1">Day</label>
            <select
              value={form.dayName}
              onChange={(e) => setForm({ ...form, dayName: e.target.value })}
              className="input-field px-3 py-2 rounded-lg"
            >
              {dayOrder.map((d) => (
                <option key={d} value={d} className="bg-slate-800">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input
              type="checkbox"
              checked={form.workoutCompleted}
              onChange={(e) =>
                setForm({ ...form, workoutCompleted: e.target.checked })
              }
            />
            Workout done
          </label>

          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input
              type="checkbox"
              checked={form.mealsFollowed}
              onChange={(e) =>
                setForm({ ...form, mealsFollowed: e.target.checked })
              }
            />
            Meals followed
          </label>

          <div>
            <label className="text-slate-400 text-xs block mb-1">
              Weight (kg, optional)
            </label>
            <input
              type="number"
              value={form.weightKg}
              onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
              className="input-field w-28 px-3 py-2 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-6 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add Log"}
          </button>
        </form>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {weightData.length > 0 && (
          <div className="interactive-card bg-dark-card border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-1">Weight Trend</h3>
            <p className="text-slate-500 text-xs mb-4">
              Your logged body weight (kg) over time
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  domain={["auto", "auto"]}
                  label={{ value: "kg", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }}
                  formatter={(value) => [`${value} kg`, "Weight"]}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#84cc16"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#84cc16" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {muscleGroupData.length > 0 && (
          <div className="interactive-card bg-dark-card border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-1">
              Muscle Groups Worked
            </h3>
            <p className="text-slate-500 text-xs mb-4">
              Number of exercises targeting each muscle group in your current plan
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={muscleGroupData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="group" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }}
                  formatter={(value) => [`${value} exercise${value !== 1 ? "s" : ""}`, "Count"]}
                  cursor={{ fill: "rgba(132, 204, 22, 0.08)" }}
                />
                <Bar dataKey="count" fill="#84cc16" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {nutritionData.length > 0 && (
          <div className="interactive-card bg-dark-card border border-white/10 rounded-2xl p-6 md:col-span-2">
            <h3 className="text-white font-semibold mb-1">
              Calories & Protein by Day
            </h3>
            <p className="text-slate-500 text-xs mb-4">
              Planned intake for each day of your current 7-day plan (green = calories, blue = protein in grams)
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={nutritionData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }}
                  formatter={(value, name) => [
                    name === "calories" ? `${value} kcal` : `${value} g`,
                    name === "calories" ? "Calories" : "Protein",
                  ]}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="calories" fill="#84cc16" radius={[4, 4, 0, 0]} name="calories" />
                <Bar dataKey="protein" fill="#f59e0b" radius={[4, 4, 0, 0]} name="protein" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {!plan && logs.length === 0 && (
          <p className="text-slate-400 md:col-span-2">
            Generate a plan on the Dashboard and log a few days to see your
            stats here.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Stats;
