# Lavatrice di casa

Calendario unico per la lavatrice di casa (GitHub Pages + **Supabase**).

## Database (Supabase)

1. Crea un progetto gratis su [supabase.com](https://supabase.com)
2. Apri **SQL Editor** → New query → incolla e Run il file `supabase/schema.sql`
3. Vai in **Project Settings → API** e copia:
   - Project URL
   - `anon` `public` key
4. Incollali in `js/db-config.js`:

```js
export const SUPABASE_URL = "https://xxxxx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

5. Fai push su GitHub: le prenotazioni saranno condivise su tutti i telefoni.

Senza queste chiavi l’app resta in modalità locale (solo quel telefono).

## Tipi di lavaggio (ambiente umido)

| Tipo | Ciclo | Appendere | Asciugatura |
|------|-------|-----------|-------------|
| Cotone / pieno | 2 h | 30 min | 24 h |
| Sintetici | 1 h 30 | 25 min | 12 h |
| Delicati / rapido | 1 h | 20 min | 10 h |
| Lenzuola / biancheria | 2 h 30 | 45 min | 36 h |

## Link

https://roddy1y.github.io/prenota-lavatrice/
