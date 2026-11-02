const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function sightingTime(sighting: {
  year: number;
  month?: number;
  day?: number;
}): number {
  if (!sighting.month) return Date.UTC(sighting.year, 6, 1);
  const day = sighting.day ?? 15;
  return Date.UTC(sighting.year, sighting.month - 1, day);
}

export function formatChartDate(sighting: {
  year: number;
  month?: number;
  day?: number;
}): string {
  if (!sighting.month) return String(sighting.year);
  const month = SHORT_MONTHS[sighting.month - 1];
  const year = String(sighting.year).slice(2);
  if (!sighting.day) return `${month} '${year}`;
  return `${sighting.day} ${month} '${year}`;
}

export function formatSightingDate(sighting: {
  year: number;
  month?: number;
  day?: number;
}): string {
  const monthName = sighting.month ? MONTHS[sighting.month - 1] : undefined;
  if (sighting.day && monthName) return `${sighting.day} ${monthName} ${sighting.year}`;
  if (monthName) return `${monthName} ${sighting.year}`;
  return String(sighting.year);
}
