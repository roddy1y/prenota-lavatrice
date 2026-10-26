import {
  WASH_TYPES,
  blockMinutes,
  formatDuration,
  washById,
} from "./config.js";
import { addBooking, listBookings, newId, removeBooking } from "./storage.js";
import {
  addDays,
  bookingsForDay,
  endOfBooking,
  findConflict,
  formatRange,
  formatTime,
  parseLocalDateTime,
  startOfWeek,
  toDateInputValue,
  washEnd,
  weekDays,
} from "./calendar.js";

/* —— Navigazione unica (tab bar iPhone) —— */
const views = {
  settimana: document.getElementById("view-settimana"),
  prenota: document.getElementById("view-prenota"),
};

function showView(name) {
  const key = name === "prenota" ? "prenota" : "settimana";
  for (const [id, el] of Object.entries(views)) {
    const on = id === key;
    el.hidden = !on;
    el.classList.toggle("is-active", on);
  }
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.go === key);
  });
  if (key === "prenota") {
    history.replaceState(null, "", "#prenota");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    history.replaceState(null, "", "#");
  }
}

document.querySelectorAll("[data-go]").forEach((el) => {
  el.addEventListener("click", () => showView(el.dataset.go));
});

showView(location.hash === "#prenota" ? "prenota" : "settimana");
window.addEventListener("hashchange", () => {
  showView(location.hash === "#prenota" ? "prenota" : "settimana");
});

/* —— Settimana —— */
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

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderWeek() {
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
    head.innerHTML = `${day.toLocaleDateString("it-IT", {
      weekday: "long",
    })}<small>${day.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
    })}</small>`;
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
          <div class="hang">Stendino occupato fino alle ${range.free}<br />(asciuga da ${range.dryingFrom} · ${formatDuration(wash.dryMin)})</div>
          <div class="actions">
            <button type="button" data-id="${b.id}">Cancella</button>
          </div>
        `;
        card.querySelector("button").addEventListener("click", () => {
          if (confirm(`Cancellare la prenotazione di ${b.name}?`)) {
            removeBooking(b.id);
            renderWeek();
          }
        });
        col.appendChild(card);
      }
    }

    grid.appendChild(col);
  }
}

document.getElementById("prev-week").addEventListener("click", () => {
  weekStart = addDays(weekStart, -7);
  renderWeek();
});
document.getElementById("next-week").addEventListener("click", () => {
  weekStart = addDays(weekStart, 7);
  renderWeek();
});
document.getElementById("today-week").addEventListener("click", () => {
  weekStart = startOfWeek(new Date());
  renderWeek();
});

window.addEventListener("bookings-changed", renderWeek);
renderWeek();

/* —— Prenota —— */
const form = document.getElementById("booking-form");
const washBox = document.getElementById("wash-options");
const preview = document.getElementById("preview");
const feedback = document.getElementById("feedback");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

dateInput.value = toDateInputValue(new Date());
timeInput.value = "09:00";

for (const wash of WASH_TYPES) {
  const label = document.createElement("label");
  label.className = "wash-option";
  label.innerHTML = `
    <input type="radio" name="washId" value="${wash.id}" required ${
      wash.id === "cotone" ? "checked" : ""
    } />
    <div>
      <div class="title">${wash.label}</div>
      <div class="detail">
        Ciclo ${formatDuration(wash.washMin)} · appendere ${formatDuration(wash.hangMin)} ·
        asciugatura ${formatDuration(wash.dryMin)} ·
        stendino occupato ${formatDuration(blockMinutes(wash))}
      </div>
    </div>
  `;
  washBox.appendChild(label);
}

function selectedWashId() {
  const el = form.querySelector('input[name="washId"]:checked');
  return el ? el.value : WASH_TYPES[0].id;
}

function updatePreview() {
  const date = dateInput.value;
  const time = timeInput.value;
  if (!date || !time) {
    preview.value = "Scegli giorno e ora…";
    return;
  }
  const wash = washById(selectedWashId());
  const start = parseLocalDateTime(date, time);
  const machineDone = start + wash.washMin * 60_000;
  const dryingFrom = start + (wash.washMin + wash.hangMin) * 60_000;
  const free = start + blockMinutes(wash) * 60_000;
  preview.value = `${formatTime(start)} → ciclo ${formatTime(machineDone)} → asciuga da ${formatTime(dryingFrom)} → stendino libero ${formatTime(free)}`;
}

form.addEventListener("change", updatePreview);
dateInput.addEventListener("input", updatePreview);
timeInput.addEventListener("input", updatePreview);
updatePreview();

function showFeedback(type, message) {
  feedback.className = `feedback show ${type}`;
  feedback.textContent = message;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const date = form.date.value;
  const time = form.time.value;
  const washId = selectedWashId();

  if (!name || !date || !time) {
    showFeedback("err", "Compila nome, giorno e ora.");
    return;
  }

  const start = parseLocalDateTime(date, time);
  if (Number.isNaN(start)) {
    showFeedback("err", "Data o ora non valide.");
    return;
  }

  const conflict = findConflict(listBookings(), start, washId);
  if (conflict) {
    const until = formatTime(endOfBooking(conflict));
    showFeedback(
      "err",
      `Stendino ancora occupato da ${conflict.name} fino alle ${until} (include asciugatura). Scegli un altro orario.`
    );
    return;
  }

  const booking = {
    id: newId(),
    name,
    washId,
    start,
    createdAt: Date.now(),
  };
  addBooking(booking);

  const wash = washById(washId);
  showFeedback(
    "ok",
    `Prenotato! ${name}: ciclo fino alle ${formatTime(
      start + wash.washMin * 60_000
    )}, asciugatura ${formatDuration(wash.dryMin)}, stendino libero alle ${formatTime(endOfBooking(booking))}.`
  );
  form.name.value = "";
  updatePreview();
  setTimeout(() => showView("settimana"), 900);
});
