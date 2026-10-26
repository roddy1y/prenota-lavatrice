# Lavatrice di casa

Calendario per prenotare la lavatrice in casa (GitHub Pages).

- **Prenota** — nome, giorno, ora, tipo di lavaggio
- **Settimana** — chi ha prenotato nei 7 giorni
- **Stendino unico** (niente asciugatrice, ambiente umido): ogni turno blocca lavaggio + appendere + **asciugatura** (tempi pessimistici)

## Tipi di lavaggio

| Tipo | Ciclo | Appendere | Asciugatura | Stendino occupato |
|------|-------|-----------|-------------|-------------------|
| Cotone / pieno | 2 h | 30 min | 24 h | 26 h 30 |
| Sintetici | 1 h 30 | 25 min | 12 h | 13 h 55 |
| Delicati / rapido | 1 h | 20 min | 10 h | 11 h 20 |
| Lenzuola / biancheria | 2 h 30 | 45 min | 36 h | 39 h 15 |

I minuti si cambiano in `js/config.js` (`washMin`, `hangMin`, `dryMin`).

## Codice casa

Tutti devono usare lo **stesso codice casa** (default: `casa`) così le prenotazioni sono condivise tra i telefoni. Si cambia dalla barra in alto.

## GitHub Pages

Il sito è statico: abilita Pages sul branch `main`, cartella `/` (root).

URL tipico: `https://<utente>.github.io/prenota-lavatrice/`
