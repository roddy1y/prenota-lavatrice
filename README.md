# Lavatrice di casa

Calendario per prenotare la lavatrice in casa (GitHub Pages).

- **Prenota** — nome, giorno, ora, tipo di lavaggio
- **Settimana** — chi ha prenotato nei 7 giorni
- Tra un lavaggio e l’altro resta bloccato il tempo per **appendere** (stendino unico, niente asciugatrice)

## Tipi di lavaggio

| Tipo | Ciclo | Appendere | Slot totale |
|------|-------|-----------|-------------|
| Cotone / pieno | 2 h | 45 min | 2 h 45 |
| Sintetici | 1 h 30 | 40 min | 2 h 10 |
| Delicati / rapido | 1 h | 30 min | 1 h 30 |
| Lenzuola / biancheria | 2 h 30 | 1 h | 3 h 30 |

I minuti si cambiano in `js/config.js`.

## Codice casa

Tutti devono usare lo **stesso codice casa** (default: `casa`) così le prenotazioni sono condivise tra i telefoni. Si cambia dalla barra in alto.

## GitHub Pages

Il sito è statico: abilita Pages sul branch `main`, cartella `/` (root).

URL tipico: `https://<utente>.github.io/prenota-lavatrice/`
