import { STORAGE_KEY } from "./config.js";

const HOUSE_KEY = "prenota-lavatrice-house";
const DEFAULT_HOUSE = "casa";

/** @type {Map<string, object>} */
let cache = new Map();
/** @type {null | { get: Function }} */
let gunRoot = null;
let ready = false;

function houseId() {
  let id = localStorage.getItem(HOUSE_KEY);
  if (!id) {
    id = DEFAULT_HOUSE;
    localStorage.setItem(HOUSE_KEY, id);
  }
  return id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || DEFAULT_HOUSE;
}

function emit() {
  window.dispatchEvent(new CustomEvent("bookings-changed"));
}

function fromCache() {
  return [...cache.values()].sort((a, b) => a.start - b.start);
}

function persistLocalMirror() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fromCache()));
}

function loadLocalMirror() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return;
    for (const b of data) {
      if (b?.id) cache.set(b.id, b);
    }
  } catch {
    /* ignore */
  }
}

function initGun() {
  if (typeof window === "undefined" || !window.Gun) {
    ready = true;
    emit();
    return;
  }

  const gun = window.Gun({
    peers: [
      "https://gun-manhattan.herokuapp.com/gun",
      "https://peer.wallie.io/gun",
    ],
  });

  gunRoot = gun.get(`prenota-lavatrice-v1`).get(houseId()).get("bookings");

  gunRoot.map().on((data, id) => {
    if (!data || data._deleted) {
      cache.delete(id);
    } else if (data.id) {
      cache.set(id, {
        id: data.id,
        name: data.name,
        washId: data.washId,
        start: Number(data.start),
        createdAt: Number(data.createdAt) || Date.now(),
      });
    }
    persistLocalMirror();
    emit();
  });

  ready = true;
  // Piccolo ritardo: lascia arrivare i peer, poi rifletti lo stato
  setTimeout(emit, 400);
}

loadLocalMirror();

export function getHouseCode() {
  return houseId();
}

export function setHouseCode(code) {
  const clean = String(code || DEFAULT_HOUSE)
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 40);
  localStorage.setItem(HOUSE_KEY, clean || DEFAULT_HOUSE);
  cache = new Map();
  location.reload();
}

export function listBookings() {
  return fromCache();
}

export function addBooking(booking) {
  cache.set(booking.id, booking);
  persistLocalMirror();
  emit();
  if (gunRoot) {
    gunRoot.get(booking.id).put({
      id: booking.id,
      name: booking.name,
      washId: booking.washId,
      start: booking.start,
      createdAt: booking.createdAt,
      _deleted: false,
    });
  }
  return booking;
}

export function removeBooking(id) {
  cache.delete(id);
  persistLocalMirror();
  emit();
  if (gunRoot) {
    gunRoot.get(id).put({ id, _deleted: true, name: null, washId: null, start: null });
  }
}

export function clearAllBookings() {
  for (const id of [...cache.keys()]) removeBooking(id);
}

export function newId() {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function whenReady(cb) {
  if (ready) cb();
  else window.addEventListener("bookings-changed", () => cb(), { once: true });
}

// Carica Gun da CDN poi avvia sync
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/gun/gun.js";
script.async = true;
script.onload = initGun;
script.onerror = () => {
  ready = true;
  emit();
};
document.head.appendChild(script);
