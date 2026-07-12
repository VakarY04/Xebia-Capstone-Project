const weekdayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const normalizePlanDay = (day, index) => {
  const weekNumber = Number(day.weekNumber) || Math.floor(index / 7) + 1;
  const dayName = day.day || weekdayOrder[index % 7];

  return {
    ...day,
    weekNumber,
    day: dayName,
    dayName,
    dayNumberInWeek: (index % 7) + 1,
    planDayId: day.planDayId || `week-${weekNumber}-${dayName}-${index}`,
  };
};

export const getPlanTotalWeeks = (plan) => {
  if (!plan?.days?.length) return 1;
  if (Number(plan.totalWeeks)) return Number(plan.totalWeeks);

  const highestWeek = Math.max(
    ...plan.days.map((day, index) => Number(day.weekNumber) || Math.floor(index / 7) + 1)
  );

  return Math.max(1, highestWeek);
};

export const normalizePlanDays = (plan) => {
  if (!plan?.days?.length) return [];
  return plan.days.map(normalizePlanDay);
};

export const getPlanWeeks = (plan) => {
  const days = normalizePlanDays(plan);
  const totalWeeks = getPlanTotalWeeks(plan);

  return Array.from({ length: totalWeeks }, (_, index) => ({
    weekNumber: index + 1,
    days: days.filter((day) => day.weekNumber === index + 1),
  }));
};

const stripTime = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

export const getWeekNumberForDate = (plan, date = new Date()) => {
  const totalWeeks = getPlanTotalWeeks(plan);
  if (!plan?.createdAt) return 1;

  const createdAt = stripTime(plan.createdAt);
  const currentDate = stripTime(date);
  const diffDays = Math.max(
    0,
    Math.floor((currentDate.getTime() - createdAt.getTime()) / 86400000)
  );

  return Math.min(totalWeeks, Math.floor(diffDays / 7) + 1);
};

export const getPlanDayForDate = (plan, date = new Date()) => {
  const days = normalizePlanDays(plan);
  if (!days.length) return null;

  const weekNumber = getWeekNumberForDate(plan, date);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

  return (
    days.find((day) => day.weekNumber === weekNumber && day.dayName === dayName) ||
    days.find((day) => day.dayName === dayName) ||
    days[0]
  );
};

export const getWeekLabel = (weekNumber) => `Week ${weekNumber}`;

export const weekdayOrderMondayFirst = weekdayOrder;
