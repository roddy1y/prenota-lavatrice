/** Tipi di lavaggio e tempi (minuti).
 *  Stendino unico, niente asciugatrice.
 *  Slot bloccato = lavaggio + appendere + asciugatura sullo stendino.
 *  La prossima persona parte solo quando lo stendino è di nuovo libero.
 */
export const WASH_TYPES = [
  {
    id: "cotone",
    label: "Cotone / pieno carico",
    washMin: 120,
    hangMin: 30,
    dryMin: 720, // 12 h
    color: "#2a9d8f",
  },
  {
    id: "sintetici",
    label: "Sintetici",
    washMin: 90,
    hangMin: 25,
    dryMin: 480, // 8 h
    color: "#457b9d",
  },
  {
    id: "rapido",
    label: "Delicati / rapido",
    washMin: 60,
    hangMin: 20,
    dryMin: 360, // 6 h
    color: "#7b68a6",
  },
  {
    id: "lenzuola",
    label: "Lenzuola / biancheria",
    washMin: 150,
    hangMin: 45,
    dryMin: 960, // 16 h
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
