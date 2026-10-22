import { washById } from "./config.js";
import { listBookings, removeBooking } from "./storage.js";
import {
  addDays,
  bookingsForDay,
  formatRange,
  formatTime,
  startOfWeek,
  washEnd,
  weekDays,
} from "./calendar.js";
import { mountHouseControl } from "./house.js";

mountHouseControl(document.querySelector(".nav-links"));

const grid = document.getElementById("week-grid");
const title = document.getElementById("week-title");
let weekStart = startOfWeek(new Date());

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function render() {
  const bookings = listBookings();
  const days = weekDays(weekStart);
  const end = addDays(weekStart, 6);
  title.textContent = `${weekStart.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
  })} – ${end.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  const today = new Date();
  grid.innerHTML = "";

  for (const day of days) {
    const col = document.createElement("article");
    col.className = "day-col" + (isSameDay(day, today) ? " today" : "");

    const head = document.createElement("div");
    head.className = "day-head";
    head.innerHTML = `${day.toLocaleDateString("it-IT", { weekday: "long" })}<small>${day.toLocaleDateString(
      "it-IT",
      { day: "numeric", month: "short" }
    )}</small>`;
    col.appendChild(head);

    const dayBookings = bookingsForDay(bookings, day);
    if (dayBookings.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-day";
      empty.textContent = "Libera";
      col.appendChild(empty);
    } else {
      for (const b of dayBookings) {
        const wash = washById(b.washId);
        const range = formatRange(b);
        const card = document.createElement("div");
        card.className = "booking-card";
        card.style.background = wash.color;
        card.innerHTML = `
          <strong>${escapeHtml(b.name)}</strong>
          <div class="meta">${range.start} → fine ciclo ${formatTime(washEnd(b))}</div>
          <div class="meta">${escapeHtml(wash.label)}</div>
          <div class="hang">Appendere fino alle ${range.free} · poi libera</div>
          <div class="actions">
            <button type="button" data-id="${b.id}">Cancella</button>
          </div>
        `;
        card.querySelector("button").addEventListener("click", () => {
          if (confirm(`Cancellare la prenotazione di ${b.name}?`)) {
            removeBooking(b.id);
            render();
          }
        });
        col.appendChild(card);
      }
    }

    grid.appendChild(col);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.getElementById("prev-week").addEventListener("click", () => {
  weekStart = addDays(weekStart, -7);
  render();
});
document.getElementById("next-week").addEventListener("click", () => {
  weekStart = addDays(weekStart, 7);
  render();
});
document.getElementById("today-week").addEventListener("click", () => {
  weekStart = startOfWeek(new Date());
  render();
});

window.addEventListener("bookings-changed", render);
render();
