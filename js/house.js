import { getHouseCode, setHouseCode } from "./storage.js";

/** Aggiunge il selettore codice casa nella nav. */
export function mountHouseControl(navEl) {
  if (!navEl) return;

  const wrap = document.createElement("div");
  wrap.style.cssText =
    "display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;width:100%;margin-top:0.65rem;";

  const label = document.createElement("label");
  label.style.cssText =
    "display:flex;align-items:center;gap:0.4rem;font-size:0.78rem;font-weight:600;color:var(--ink-soft);";
  label.innerHTML = `Codice casa
    <input type="text" id="house-code" maxlength="40" style="width:7.5rem;padding:0.35rem 0.55rem;border-radius:10px;border:1px solid var(--stroke);font:inherit;font-weight:600;" />
  `;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ghost";
  btn.textContent = "Unisci";
  btn.style.fontSize = "0.78rem";
  btn.style.padding = "0.35rem 0.65rem";

  wrap.appendChild(label);
  wrap.appendChild(btn);

  const parent = navEl.parentElement;
  parent.insertBefore(wrap, navEl.nextSibling);

  const input = wrap.querySelector("#house-code");
  input.value = getHouseCode();

  btn.addEventListener("click", () => {
    const next = input.value.trim();
    if (!next) return;
    if (next === getHouseCode()) return;
    if (
      confirm(
        `Passare al codice casa "${next}"? Tutti in casa devono usare lo stesso codice per vedere le stesse prenotazioni.`
      )
    ) {
      setHouseCode(next);
    }
  });
}
