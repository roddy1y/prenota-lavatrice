import { STORAGE_KEY } from "./config.js";
import { isDbConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "./db-config.js";

/** @type {Map<string, object>} */
let cache = new Map();
/** @type {any} */
let supabase = null;
let ready = false;
let usingDb = false;

function emit() {
  window.dispatchEvent(
    new CustomEvent("bookings-changed", {
      detail: { usingDb, ready, error: lastError },
    })
  );
}

let lastError = null;

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

function rowToBooking(row) {
  return {
    id: row.id,
    name: row.name,
    washId: row.wash_id,
    start: Number(row.start_ms),
    createdAt: Number(row.created_at) || Date.now(),
  };
}

async function refreshFromDb() {
  const { data, error } = await supabase
    .from("bookings")
    .select("id,name,wash_id,start_ms,created_at")
    .order("start_ms", { ascending: true });

  if (error) throw error;

  cache = new Map();
  for (const row of data || []) {
    const b = rowToBooking(row);
    cache.set(b.id, b);
  }
  persistLocalMirror();
  emit();
}

function subscribeRealtime() {
  supabase
    .channel("bookings-casa")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookings" },
      () => {
        refreshFromDb().catch((err) => {
          lastError = err.message || String(err);
          emit();
        });
      }
    )
    .subscribe();
}

async function initSupabase() {
  if (!isDbConfigured()) {
    usingDb = false;
    ready = true;
    lastError = null;
    emit();
    return;
  }

  if (!window.supabase?.createClient) {
    usingDb = false;
    ready = true;
    lastError = "Libreria Supabase non caricata";
    emit();
    return;
  }

  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    usingDb = true;
    await refreshFromDb();
    subscribeRealtime();
    lastError = null;
  } catch (err) {
    usingDb = false;
    lastError = err.message || String(err);
  } finally {
    ready = true;
    emit();
  }
}

loadLocalMirror();

export function listBookings() {
  return fromCache();
}

export function getStorageStatus() {
  return {
    ready,
    usingDb,
    configured: isDbConfigured(),
    error: lastError,
  };
}

export async function addBooking(booking) {
  cache.set(booking.id, booking);
  persistLocalMirror();
  emit();

  if (!usingDb || !supabase) return booking;

  const { error } = await supabase.from("bookings").insert({
    id: booking.id,
    name: booking.name,
    wash_id: booking.washId,
    start_ms: booking.start,
    created_at: booking.createdAt,
  });

  if (error) {
    cache.delete(booking.id);
    persistLocalMirror();
    lastError = error.message;
    emit();
    throw error;
  }

  lastError = null;
  return booking;
}

export async function removeBooking(id) {
  cache.delete(id);
  persistLocalMirror();
  emit();

  if (!usingDb || !supabase) return;

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) {
    lastError = error.message;
    emit();
    throw error;
  }
  lastError = null;
}

export function newId() {
  if (crypto?.randomUUID) return `b_${crypto.randomUUID()}`;
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function loadScript() {
  if (!isDbConfigured()) {
    ready = true;
    emit();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
  script.async = true;
  script.onload = () => initSupabase();
  script.onerror = () => {
    usingDb = false;
    ready = true;
    lastError = "Impossibile caricare Supabase";
    emit();
  };
  document.head.appendChild(script);
}

loadScript();
