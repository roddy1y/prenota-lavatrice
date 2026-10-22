import { blockMinutes, washById } from "./config.js";

/** Lunedì della settimana che contiene `date` (locale). */
export function startOfWeek(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = dom
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function endOfBooking(booking) {
  const wash = washById(booking.washId);
  return booking.start + blockMinutes(wash) * 60_000;
}

export function washEnd(booking) {
  const wash = washById(booking.washId);
  return booking.start + wash.washMin * 60_000;
}

/** Intervalli [start, end) si sovrappongono? */
export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

export function findConflict(bookings, startMs, washId, excludeId = null) {
  const wash = washById(washId);
  const endMs = startMs + blockMinutes(wash) * 60_000;
  return bookings.find((b) => {
    if (excludeId && b.id === excludeId) return false;
    return overlaps(startMs, endMs, b.start, endOfBooking(b));
  });
}

export function formatDayLabel(date) {
  return date.toLocaleDateString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTime(ms) {
  return new Date(ms).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRange(booking) {
  const wash = washById(booking.washId);
  const start = formatTime(booking.start);
  const machineDone = formatTime(washEnd(booking));
  const free = formatTime(endOfBooking(booking));
  return {
    start,
    machineDone,
    free,
    washLabel: wash.label,
    hangMin: wash.hangMin,
  };
}

export function parseLocalDateTime(dateStr, timeStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0).getTime();
}

export function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function weekDays(weekStart) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function bookingsForDay(bookings, day) {
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = addDays(start, 1);
  const t0 = start.getTime();
  const t1 = end.getTime();
  return bookings.filter((b) => overlaps(b.start, endOfBooking(b), t0, t1));
}
