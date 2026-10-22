import {
  WASH_TYPES,
  blockMinutes,
  formatDuration,
  washById,
} from "./config.js";
import { addBooking, listBookings, newId } from "./storage.js";
import {
  endOfBooking,
  findConflict,
  formatTime,
  parseLocalDateTime,
  toDateInputValue,
} from "./calendar.js";
import { mountHouseControl } from "./house.js";

mountHouseControl(document.querySelector(".nav-links"));

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
        slot totale ${formatDuration(blockMinutes(wash))}
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
  const free = start + blockMinutes(wash) * 60_000;
  preview.value = `${formatTime(start)} → ciclo ${formatTime(machineDone)} → libera ${formatTime(free)}`;
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
      `Slot occupato: ${conflict.name} fino alle ${until} (include tempo per appendere). Scegli un altro orario.`
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
    `Prenotato! ${name}: lavaggio fino alle ${formatTime(
      start + wash.washMin * 60_000
    )}, stendino/libera alle ${formatTime(endOfBooking(booking))}.`
  );
  form.name.value = "";
  updatePreview();
});
