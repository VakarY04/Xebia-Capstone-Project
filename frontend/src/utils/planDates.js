export const weekdayOrder = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const pad = (value) => String(value).padStart(2, "0");

export const getTodayDateKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

export const deriveDateKey = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const parseDateKey = (dateKey) => new Date(`${dateKey}T12:00:00`);

export const formatDateLabel = (
  dateKey,
  options = { weekday: "short", month: "short", day: "numeric" }
) => parseDateKey(dateKey).toLocaleDateString("en-US", options);

export const getDayNameFromDateKey = (dateKey) =>
  parseDateKey(dateKey).toLocaleDateString("en-US", { weekday: "long" });

export const getLogDateKey = (log) => log?.dateKey || deriveDateKey(log?.date);

export const groupPlanWeeks = (plan) => {
  if (!plan?.days?.length) {
    return [];
  }

  const weekMap = new Map();
  plan.days.forEach((day, index) => {
    const weekNumber = day.weekNumber || Math.floor(index / 7) + 1;
    if (!weekMap.has(weekNumber)) {
      weekMap.set(weekNumber, []);
    }
    weekMap.get(weekNumber).push(day);
  });

  return [...weekMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([weekNumber, days]) => ({
      weekNumber,
      days: days.sort((a, b) => (a.dayIndex ?? 0) - (b.dayIndex ?? 0)),
    }));
};

export const getDefaultActiveDayKey = (plan) => {
  const today = getTodayDateKey();
  if (plan?.days?.some((day) => day.dateKey === today)) {
    return today;
  }

  return plan?.days?.[0]?.dateKey || today;
};

export const getDefaultActiveWeek = (plan) => {
  const activeDayKey = getDefaultActiveDayKey(plan);
  return plan?.days?.find((day) => day.dateKey === activeDayKey)?.weekNumber || 1;
};
