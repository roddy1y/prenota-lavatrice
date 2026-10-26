/** Tipi di lavaggio e tempi (minuti).
 *  Stendino unico, niente asciugatrice, ambiente umido (~21 °C).
 *  dryMin = scenario pessimistico (carico fitto + umidità alta).
 *  Slot bloccato = lavaggio + appendere + asciugatura.
 */
export const WASH_TYPES = [
  {
    id: "cotone",
    label: "Cotone / pieno carico",
    washMin: 120,
    hangMin: 30,
    dryMin: 1440, // 24 h
    color: "#2a9d8f",
  },
  {
    id: "sintetici",
    label: "Sintetici",
    washMin: 90,
    hangMin: 25,
    dryMin: 720, // 12 h
    color: "#457b9d",
  },
  {
    id: "rapido",
    label: "Delicati / rapido",
    washMin: 60,
    hangMin: 20,
    dryMin: 600, // 10 h
    color: "#7b68a6",
  },
  {
    id: "lenzuola",
    label: "Lenzuola / biancheria",
    washMin: 150,
    hangMin: 45,
    dryMin: 2160, // 36 h
    color: "#c45c26",
  },
];

export const DAY_START_HOUR = 7;
export const DAY_END_HOUR = 23;
export const SLOT_MINUTES = 30;

export const STORAGE_KEY = "prenota-lavatrice-v1";

/** Canale sync fisso: solo questa casa, niente codice da inserire. */
export const HOUSE_CHANNEL = "roddy1y-casa-lavatrice-privata";

export function washById(id) {
  return WASH_TYPES.find((w) => w.id === id) ?? WASH_TYPES[0];
}

/** Minuti totali in cui lavatrice+stendino bloccano il prossimo turno. */
export function blockMinutes(wash) {
  return wash.washMin + wash.hangMin + (wash.dryMin ?? 0);
}

export function formatDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return h === 1 ? "1 h" : `${h} h`;
  return `${h} h ${m} min`;
}
