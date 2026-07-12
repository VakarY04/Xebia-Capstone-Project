import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios.js";
import AppHeader from "../components/AppHeader.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";
import {
  CheckIcon,
  FlameIcon,
  ProteinIcon,
  StreakIcon,
  WaterIcon,
  WorkoutIcon,
} from "../components/AppIcons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  formatDateLabel,
  getDefaultActiveDayKey,
  getDefaultActiveWeek,
  getLogDateKey,
  groupPlanWeeks,
} from "../utils/planDates.js";

const buildLogLookups = (logs) => {
  const byDateKey = new Map();
  const latestByDayName = new Map();

  logs.forEach((log) => {
    const dateKey = getLogDateKey(log);
    const currentByDate = byDateKey.get(dateKey) || {
      ...log,
      dateKey,
      workoutCompleted: false,
      mealsFollowed: false,
      waterLiters: 0,
    };

    currentByDate.workoutCompleted =
      currentByDate.workoutCompleted || Boolean(log.workoutCompleted);
    currentByDate.mealsFollowed =
      currentByDate.mealsFollowed || Boolean(log.mealsFollowed);
    currentByDate.waterLiters += Number(log.waterLiters || 0);
    if (log.weightKg !== null && log.weightKg !== undefined && log.weightKg !== "") {
      currentByDate.weightKg = Number(log.weightKg);
    }

    byDateKey.set(dateKey, currentByDate);

    const currentByDay = latestByDayName.get(log.dayName);
    if (!currentByDay || new Date(log.updatedAt || log.createdAt || log.date) > new Date(currentByDay.updatedAt || currentByDay.createdAt || currentByDay.date)) {
      latestByDayName.set(log.dayName, { ...currentByDate, dayName: log.dayName });
    }
  });

  return { byDateKey, latestByDayName };
};

const MetricCard = ({ icon, iconTone, label, value, helper }) => (
  <div className="app-stat-card">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <p className="mt-3 break-words text-3xl font-semibold tracking-tight text-slate-950">
          {value}
        </p>
      </div>
      <div className={`app-stat-icon ${iconTone}`}>{icon}</div>
    </div>
    <p className="mt-4 text-sm text-slate-600">{helper}</p>
  </div>
);

const ReminderRow = ({ label, done, meta }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
    <div className="min-w-0">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="mt-1 text-xs text-slate-600">{meta}</p>
    </div>
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
        done ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {done ? <CheckIcon className="h-3.5 w-3.5" /> : null}
      {done ? "Done" : "Pending"}
    </span>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [planRes, logsRes] = await Promise.allSettled([
        api.get("/plans/latest"),
        api.get("/logs"),
      ]);

      if (planRes.status === "fulfilled") setPlan(planRes.value.data);
      if (logsRes.status === "fulfilled") setLogs(logsRes.value.data);
      setLoading(false);
    };

    load();
  }, []);

  const planWeeks = useMemo(() => groupPlanWeeks(plan), [plan]);
  const activeWeek = useMemo(() => getDefaultActiveWeek(plan), [plan]);
  const currentWeekDays =
    planWeeks.find((week) => week.weekNumber === activeWeek)?.days || [];
  const activeDayKey = getDefaultActiveDayKey(plan);
  const todayPlanDay = plan?.days?.find((day) => day.dateKey === activeDayKey);

  const { byDateKey, latestByDayName } = useMemo(() => buildLogLookups(logs), [logs]);

  const resolveLogForDay = (day) =>
    byDateKey.get(day.dateKey) || latestByDayName.get(day.day);

  const todaySummary = todayPlanDay ? resolveLogForDay(todayPlanDay) : null;
  const todayWater = Number(todaySummary?.waterLiters || 0);

  const streak = useMemo(() => {
    const sorted = [...byDateKey.values()].sort((a, b) => new Date(b.date) - new Date(a.date));
    let count = 0;

    for (const entry of sorted) {
      if (!entry.workoutCompleted) break;
      count += 1;
    }

    return count;
  }, [byDateKey]);

  const weeklyActivity = useMemo(() => {
    if (currentWeekDays.length > 0) {
      return currentWeekDays.map((day) => {
        const log = resolveLogForDay(day);
        return {
          day: day.day.slice(0, 3),
          dateLabel: formatDateLabel(day.dateKey, { month: "short", day: "numeric" }),
          completed: log?.workoutCompleted ? 1 : 0,
        };
      });
    }

    return [];
  }, [currentWeekDays, byDateKey, latestByDayName]);

  const weeklyGoalPct = useMemo(() => {
    const targetDays = currentWeekDays.filter((day) => !day.isRestDay).length || user?.availableDays?.length || 7;
    const completed = weeklyActivity.filter((day) => day.completed).length;
    return Math.min(100, Math.round((completed / targetDays) * 100));
  }, [currentWeekDays, user, weeklyActivity]);

  const weeklyGoalRing = {
    background: `conic-gradient(#7c5cff ${weeklyGoalPct}%, #ede9fe ${weeklyGoalPct}% 100%)`,
  };

  const workoutPreview = todayPlanDay?.workout?.exercises?.slice(0, 4) || [];
  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "morning" : greetingHour < 18 ? "afternoon" : "evening";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center">
          <div className="card-light px-6 py-5 text-sm font-medium text-slate-600">
            Loading your dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AppHeader
        title={`Good ${greeting}, ${user?.name?.split(" ")[0] || "Athlete"}`}
        subtitle="Here is your fitness and nutrition overview."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<FlameIcon />}
          iconTone="bg-orange-50 text-orange-600"
          label="Calories Today"
          value={todayPlanDay ? `${todayPlanDay.totalCalories} kcal` : "-"}
          helper={todayPlanDay?.dateKey ? `For ${formatDateLabel(todayPlanDay.dateKey)}` : "Generate a plan to see this"}
        />
        <MetricCard
          icon={<ProteinIcon />}
          iconTone="bg-blue-50 text-blue-600"
          label="Protein Today"
          value={todayPlanDay ? `${todayPlanDay.totalProtein} g` : "-"}
          helper="Pulled from your active meal plan"
        />
        <MetricCard
          icon={<WaterIcon />}
          iconTone="bg-cyan-50 text-cyan-600"
          label="Water Intake"
          value={`${todayWater.toFixed(1)} L`}
          helper="Daily hydration target: 2.5 L"
        />
        <MetricCard
          icon={<StreakIcon />}
          iconTone="bg-violet-50 text-violet-600"
          label="Current Streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
          helper="Consecutive logged workout days"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <section className="app-grid-panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="app-section-title">Activity Overview</h2>
              <p className="app-section-subtitle">
                {plan ? `Week ${activeWeek} of your active plan` : "Generate a plan to populate weekly activity"}
              </p>
            </div>
            <span className="rounded-2xl bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              {plan ? `Week ${activeWeek}` : "No plan"}
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-full p-3" style={weeklyGoalRing}>
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-4xl font-semibold tracking-tight text-slate-950">
                    {weeklyGoalPct}%
                  </span>
                  <span className="mt-1 text-sm font-medium text-slate-600">Weekly Goal</span>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">
                {weeklyGoalPct >= 100 ? "Target met" : "Keep your momentum going"}
              </p>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity} barGap={18}>
                  <CartesianGrid stroke="#dbe4f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 1]} />
                  <Tooltip
                    cursor={{ fill: "rgba(124, 92, 255, 0.08)" }}
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #dbe4f0",
                      borderRadius: 18,
                    }}
                    formatter={(value, _name, context) => [value ? "Workout completed" : "No workout logged", context?.payload?.dateLabel || ""]}
                  />
                  <Bar dataKey="completed" fill="#7c5cff" radius={[10, 10, 0, 0]} maxBarSize={42} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="app-grid-panel">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="app-section-title">Today&apos;s Reminders</h2>
                <p className="app-section-subtitle">Quick checks for your current plan</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/stats")}
                className="text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                Log today
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <ReminderRow
                label="Drink water"
                meta={`${todayWater.toFixed(1)} L of 2.5 L goal`}
                done={todayWater >= 2.5}
              />
              <ReminderRow
                label="Complete today&apos;s workout"
                meta={todayPlanDay?.isRestDay ? "Rest day on the plan" : "Workout status from your daily log"}
                done={Boolean(todaySummary?.workoutCompleted) || Boolean(todayPlanDay?.isRestDay)}
              />
              <ReminderRow
                label="Log today&apos;s meals"
                meta="Meal adherence from your daily log"
                done={Boolean(todaySummary?.mealsFollowed)}
              />
            </div>
          </section>

          <section className="app-grid-panel">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="app-section-title">Today&apos;s Workout</h2>
                <p className="app-section-subtitle">
                  {todayPlanDay?.dateKey ? formatDateLabel(todayPlanDay.dateKey, { weekday: "long", month: "short", day: "numeric" }) : "No active plan yet"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/meal-plan")}
                className="text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                View full plan
              </button>
            </div>

            {!plan ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm font-medium text-slate-600">
                No plan yet. Go to Workout and Meals to generate your first plan.
              </div>
            ) : todayPlanDay?.isRestDay ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm font-medium text-slate-700">
                Today is marked as recovery. A short walk, stretching, or mobility session fits the plan.
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    <WorkoutIcon />
                    Workout Focus
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                    {todayPlanDay?.workout?.focus || "Training Day"}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {todayPlanDay?.workout?.exercises?.length || 0} planned exercises for this day.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {workoutPreview.map((exercise) => (
                    <div key={exercise.name} className="app-subtle-panel min-w-0 p-4">
                      <p className="break-words text-sm font-semibold text-slate-900">
                        {exercise.name}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-600">
                        {exercise.muscleGroup}
                      </p>
                      <p className="mt-3 text-sm font-medium text-slate-700">
                        {exercise.sets} x {exercise.reps}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-[30px] bg-slate-950 px-6 py-5 text-white shadow-shell">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
              Daily Motivation
            </p>
            <p className="mt-2 text-lg font-medium">
              Discipline today. Strength tomorrow.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/meal-plan")}
            className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Review plan
          </button>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
