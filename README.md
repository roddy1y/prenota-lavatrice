# Lavatrice di casa

Calendario per prenotare la lavatrice in casa (GitHub Pages).

- **Prenota** — nome, giorno, ora, tipo di lavaggio
- **Settimana** — chi ha prenotato nei 7 giorni
- **Stendino unico** (niente asciugatrice): ogni turno blocca lavaggio + appendere + **asciugatura**

## Tipi di lavaggio

| Tipo | Ciclo | Appendere | Asciugatura | Stendino occupato |
|------|-------|-----------|-------------|-------------------|
| Cotone / pieno | 2 h | 30 min | 12 h | 14 h 30 |
| Sintetici | 1 h 30 | 25 min | 8 h | 9 h 55 |
| Delicati / rapido | 1 h | 20 min | 6 h | 7 h 20 |
| Lenzuola / biancheria | 2 h 30 | 45 min | 16 h | 19 h 15 |

I minuti si cambiano in `js/config.js` (`washMin`, `hangMin`, `dryMin`).

## Codice casa

Tutti devono usare lo **stesso codice casa** (default: `casa`) così le prenotazioni sono condivise tra i telefoni. Si cambia dalla barra in alto.

## GitHub Pages

Il sito è statico: abilita Pages sul branch `main`, cartella `/` (root).

URL tipico: `https://<utente>.github.io/prenota-lavatrice/`
