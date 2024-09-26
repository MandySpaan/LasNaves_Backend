export const getReportDate = (): Date => {
  const today = new Date();
  today.setDate(today.getDate() - 1);

  const reportDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return reportDate;
};

export const getYesterdayDateRange = (): { start: Date; end: Date } => {
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};
