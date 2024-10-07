export const getDailyReportDate = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  let daysToSubtract;
  if (dayOfWeek === 0) {
    daysToSubtract = 2;
  } else if (dayOfWeek === 1) {
    daysToSubtract = 3;
  } else {
    daysToSubtract = 1;
  }

  today.setDate(today.getDate() - daysToSubtract);

  const reportDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return reportDate;
};

export const getLastWorkdayDateRange = (): { start: Date; end: Date } => {
  const now = new Date();
  const dayOfWeek = now.getDay();

  let daysToSubtract;
  if (dayOfWeek === 0) {
    daysToSubtract = 2;
  } else if (dayOfWeek === 1) {
    daysToSubtract = 3;
  } else {
    daysToSubtract = 1;
  }

  const start = new Date(now);
  start.setDate(now.getDate() - daysToSubtract);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};
