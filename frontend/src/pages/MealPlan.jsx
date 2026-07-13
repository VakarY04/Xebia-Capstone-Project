import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import AppHeader from "../components/AppHeader.jsx";
import { FlameIcon, MealIcon, WaterIcon, WorkoutIcon } from "../components/AppIcons.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";
import {
  formatDateLabel,
  getDefaultActiveDayKey,
  getDefaultActiveWeek,
  getTodayDateKey,
  groupPlanWeeks,
} from "../utils/planDates.js";

const mealSections = [
  ["Breakfast", "breakfast"],
  ["Lunch", "lunch"],
  ["Dinner", "dinner"],
];

const MacroStat = ({ label, value, unit, progressColor }) => {
  const safeValue = Number(value || 0);

  return (
    <div className="app-subtle-panel p-4">
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        {safeValue}
        <span className="ml-1 text-sm font-medium text-slate-600">{unit}</span>
      </p>
      <div className="app-progress-track mt-4 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: progressColor }} />
      </div>
    </div>
  );
};

const MealCard = ({ label, meal }) => {
  if (!meal) return null;

  return (
    <div className="app-list-row items-start">
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MealIcon />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {label}
            </p>
            <span className="app-tag">Meal target</span>
          </div>
          <h3 className="mt-2 break-words text-lg font-semibold tracking-tight text-slate-950">
            {meal.name}
          </h3>
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            <span>P: {meal.protein} g</span>
            <span>C: {meal.carbs} g</span>
            <span>F: {meal.fats} g</span>
          </div>
        </div>
      </div>
      <div className="shrink-0 rounded-2xl bg-slate-50 px-4 py-3 text-right">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Energy</p>
        <p className="mt-2 text-lg font-semibold text-slate-950">{meal.calories} kcal</p>
      </div>
    </div>
  );
};

const WorkoutExercise = ({ exercise }) => (
  <div className="app-list-row items-start">
    <div className="min-w-0 flex-1">
      <p className="break-words text-base font-semibold text-slate-950">{exercise.name}</p>
      <p className="mt-1 text-sm font-medium text-slate-600">{exercise.muscleGroup}</p>
    </div>
    <div className="shrink-0 text-right text-sm font-medium text-slate-700">
      <p className="font-semibold text-slate-900">{exercise.sets} sets</p>
      <p>{exercise.reps} reps</p>
    </div>
  </div>
);

const weekOptions = [1, 2, 3, 4];

const MealPlan = () => {
  const [plan, setPlan] = useState(null);
  const [durationWeeks, setDurationWeeks] = useState(1);
  const [startDate, setStartDate] = useState(getTodayDateKey());
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeDayKey, setActiveDayKey] = useState(getTodayDateKey());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const applyPlanState = (nextPlan) => {
    setPlan(nextPlan);
    setDurationWeeks(nextPlan?.totalWeeks || 1);
    setStartDate(nextPlan?.startDate || getTodayDateKey());
    setActiveWeek(getDefaultActiveWeek(nextPlan));
    setActiveDayKey(getDefaultActiveDayKey(nextPlan));
  };

  const loadPlan = async () => {
    setLoading(true);
    try {
      const res = await api.get("/plans/latest");
      applyPlanState(res.data);
    } catch {
      setPlan(null);
      setDurationWeeks(1);
      setStartDate(getTodayDateKey());
      setActiveWeek(1);
      setActiveDayKey(getTodayDateKey());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await api.post("/plans/generate", {
        weeks: durationWeeks,
        startDate,
      });
      applyPlanState(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate your plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const planWeeks = useMemo(() => groupPlanWeeks(plan), [plan]);
  const currentWeekDays = planWeeks.find((week) => week.weekNumber === activeWeek)?.days || [];
  const activeDayData = plan?.days?.find((day) => day.dateKey === activeDayKey);
  const snacks = activeDayData?.meals?.snacks || [];
  const totalMealCount = mealSections.filter(([, key]) => activeDayData?.meals?.[key]).length + snacks.length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center">
          <div className="card-light px-6 py-5 text-sm font-medium text-slate-600">Loading your plan...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AppHeader
        title="Workout and Meals"
        subtitle="Generate 1 to 4 weeks of training and nutrition from the same page."
        actions={
          <button type="button" onClick={handleGenerate} disabled={generating} className="btn-primary">
            {generating ? "Generating..." : plan ? "Regenerate Plan" : "Generate Plan"}
          </button>
        }
      />

      <section className="mt-6 app-grid-panel">
        <div className="grid gap-4 md:grid-cols-2 lg:max-w-[520px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Plan length</label>
            <select
              value={durationWeeks}
              onChange={(event) => setDurationWeeks(Number(event.target.value))}
              className="input-field-light w-full px-4 py-3"
            >
              {weekOptions.map((week) => (
                <option key={week} value={week}>
                  {week} week{week === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="input-field-light w-full px-4 py-3"
            />
          </div>
        </div>
      </section>

      {error ? (
        <div className="mt-6 rounded-[26px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {!plan && !generating ? (
        <section className="mt-6 app-grid-panel p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Generate your first plan</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-slate-600">
            The app will build a workout and meal plan from your onboarding data, then assign each day to the calendar starting from the date you choose above.
          </p>
        </section>
      ) : null}

      {generating ? (
        <section className="mt-6 app-grid-panel p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Building your plan</h2>
          <p className="mt-3 text-sm font-medium text-slate-600">
            The AI is generating your workouts and meals for the selected number of weeks.
          </p>
        </section>
      ) : null}

      {plan ? (
        <>
          <section className="mt-6 app-grid-panel">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Plan Calendar</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  {activeDayData?.dateKey ? formatDateLabel(activeDayData.dateKey, { weekday: "long", month: "long", day: "numeric" }) : "Select a day"}
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {activeDayData?.isRestDay
                    ? "Recovery-focused day with lighter training expectations."
                    : `${totalMealCount} planned meals and ${activeDayData?.workout?.exercises?.length || 0} exercises.`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {planWeeks.map((week) => (
                  <button
                    key={week.weekNumber}
                    type="button"
                    onClick={() => {
                      setActiveWeek(week.weekNumber);
                      setActiveDayKey(week.days[0]?.dateKey || activeDayKey);
                    }}
                    className={`pill-light ${activeWeek === week.weekNumber ? "pill-light-selected" : "pill-light-unselected"}`}
                  >
                    Week {week.weekNumber}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {currentWeekDays.map((day) => (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => setActiveDayKey(day.dateKey)}
                  className={`pill-light min-w-[108px] flex-col items-start gap-1 rounded-[22px] px-4 py-3 text-left ${
                    activeDayKey === day.dateKey ? "pill-light-selected" : "pill-light-unselected"
                  }`}
                >
                  <span className="text-sm font-semibold">{day.day.slice(0, 3)}</span>
                  <span className="text-xs font-medium opacity-90">
                    {formatDateLabel(day.dateKey, { month: "short", day: "numeric" })}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="card-light flex items-center gap-4 p-5 xl:col-span-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <FlameIcon />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-600">Plan Energy</p>
                  <p className="mt-2 break-words text-3xl font-semibold tracking-tight text-slate-950">
                    {activeDayData?.totalCalories || 0} kcal
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {activeDayData?.isRestDay ? "Rest-day balance" : "Daily target from your plan"}
                  </p>
                </div>
              </div>

              <MacroStat label="Protein" value={activeDayData?.totalProtein} unit="g" progressColor="#69C978" />
              <MacroStat label="Carbs" value={activeDayData?.totalCarbs} unit="g" progressColor="#8BDB97" />
              <MacroStat label="Fats" value={activeDayData?.totalFats} unit="g" progressColor="#A8E6B1" />
            </div>
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <section className="app-grid-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="app-section-title">Workout Plan</h2>
                  <p className="app-section-subtitle">
                    {activeDayData?.isRestDay ? "No heavy session scheduled for this date." : activeDayData?.workout?.focus || "Workout focus"}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <WorkoutIcon />
                </div>
              </div>

              {activeDayData?.isRestDay ? (
                <div className="mt-6 rounded-[28px] bg-slate-50 p-6 text-sm font-medium text-slate-700">
                  This date is intentionally lighter. Mobility work, stretching, and a short walk fit well here.
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {activeDayData?.workout?.exercises?.map((exercise) => (
                    <WorkoutExercise key={`${exercise.name}-${exercise.reps}`} exercise={exercise} />
                  ))}
                </div>
              )}
            </section>

            <section className="app-grid-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="app-section-title">Meal Plan</h2>
                  <p className="app-section-subtitle">Meals and snacks aligned to the same day&apos;s workout target.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                  {totalMealCount} entries
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {mealSections.map(([label, key]) => (
                  <MealCard key={key} label={label} meal={activeDayData?.meals?.[key]} />
                ))}
                {snacks.map((snack, index) => (
                  <MealCard key={`${snack.name}-${index}`} label={`Snack ${index + 1}`} meal={snack} />
                ))}
              </div>
            </section>
          </div>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="app-grid-panel">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                  <WaterIcon />
                </div>
                <div>
                  <h2 className="app-section-title">Execution Notes</h2>
                  <p className="app-section-subtitle">Use the Stats page to log the exact plan date you completed and keep dashboard charts aligned.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="app-info-tile">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Goal support</p>
                  <p className="mt-3 text-sm font-medium text-slate-700">Macros and workout intensity follow your saved onboarding goal.</p>
                </div>
                <div className="app-info-tile">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Calendar sync</p>
                  <p className="mt-3 text-sm font-medium text-slate-700">Every generated day is tied to the start date you choose above.</p>
                </div>
                <div className="app-info-tile">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Logging</p>
                  <p className="mt-3 text-sm font-medium text-slate-700">Daily logs drive reminders, adherence, streaks, and dashboard progress.</p>
                </div>
              </div>
            </div>

            <div className="app-grid-panel">
              <h2 className="app-section-title">Plan Actions</h2>
              <p className="app-section-subtitle">Keep the plan synced with your body stats, schedule, and selected calendar range.</p>
              <div className="mt-6 space-y-3">
                <button type="button" onClick={handleGenerate} disabled={generating} className="btn-primary w-full">
                  {generating ? "Generating..." : `Generate ${durationWeeks} Week Plan`}
                </button>
                <div className="rounded-[26px] bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600">
                  Current plan span: {plan.startDate} to {plan.days?.[plan.days.length - 1]?.dateKey || plan.startDate}.
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </DashboardLayout>
  );
};

export default MealPlan;

