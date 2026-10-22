/** Tipi di lavaggio e tempi (minuti).
 *  Dopo ogni ciclo serve tempo per scaricare e appendere: stendino unico, niente asciugatrice.
 *  Lo slot bloccato = durata lavaggio + tempo appendere.
 */
export const WASH_TYPES = [
  {
    id: "cotone",
    label: "Cotone / pieno carico",
    washMin: 120,
    hangMin: 45,
    color: "#2a9d8f",
  },
  {
    id: "sintetici",
    label: "Sintetici",
    washMin: 90,
    hangMin: 40,
    color: "#457b9d",
  },
  {
    id: "rapido",
    label: "Delicati / rapido",
    washMin: 60,
    hangMin: 30,
    color: "#7b68a6",
  },
  {
    id: "lenzuola",
    label: "Lenzuola / biancheria",
    washMin: 150,
    hangMin: 60,
    color: "#c45c26",
  },
];

export const DAY_START_HOUR = 7;
export const DAY_END_HOUR = 23;
export const SLOT_MINUTES = 30;

export const STORAGE_KEY = "prenota-lavatrice-v1";

export function washById(id) {
  return WASH_TYPES.find((w) => w.id === id) ?? WASH_TYPES[0];
}

export function blockMinutes(wash) {
  return wash.washMin + wash.hangMin;
}

export function formatDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return h === 1 ? "1 h" : `${h} h`;
  return `${h} h ${m} min`;
}
