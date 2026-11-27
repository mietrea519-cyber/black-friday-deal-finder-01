// DealHound's wiring: hash routes, the toolbar, and live re-rendering.
// Routes: #/ is the board, #/deal/<id> is one deal. The toolbar (search,
// category chips, store and discount selects, sort) re-renders the grid in
// place, so a screenshot of a filtered board shows the filter working.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from "./data.js";
import { applyFilters, blankState, categories, stores } from "./filters.js";
import { dealPage, listPage, missingPage, statsBlock } from "./views.js";

const app = document.getElementById("app");
const state = blankState();

function option(value, label, current) {
  return `<option value="${value}"${value === current ? " selected" : ""}>${label}</option>`;
}

function toolbar() {
  const cats = categories();
  const chips = ["All", ...cats]
    .map(
      (c) =>
        `<li><button type="button" class="chip" data-category="${c}" aria-pressed="${state.category === c}">${c}</button></li>`,
    )
    .join("");
  const storeOptions = ["All", ...stores()]
    .map((s) => option(s, s === "All" ? "All stores" : s, state.store))
    .join("");
  const offOptions = [0, 30, 40, 50]
    .map((n) => option(String(n), n === 0 ? "Any discount" : `${n}% off or more`, String(state.minOff)))
    .join("");
  const sortOptions = [
    ["discount", "Biggest discount"],
    ["saving", "Biggest saving"],
    ["price", "Lowest price"],
    ["verdict", "Best verdict first"],
  ]
    .map(([v, label]) => option(v, label, state.sort))
    .join("");
  return `<div class="toolbar">
    <div class="search-row">
      <input class="search-box" type="search" placeholder="Search deals, stores, categories…" value="${state.query.replace(/"/g, "&quot;")}" aria-label="Search deals">
      <select class="select" data-field="store" aria-label="Filter by store">${storeOptions}</select>
      <select class="select" data-field="minOff" aria-label="Minimum discount">${offOptions}</select>
      <select class="select" data-field="sort" aria-label="Sort deals">${sortOptions}</select>
    </div>
    <ul class="chips">${chips}</ul>
  </div>`;
}

function renderList() {
  const shown = applyFilters(state);
  app.innerHTML =
    toolbar() +
    statsBlock(shown) +
    `<p class="result-line">Showing <strong>${shown.length}</strong> of ${deals.length} deals${state.query ? ` for “${state.query}”` : ""}${state.category !== "All" ? ` in ${state.category}` : ""}${state.store !== "All" ? ` at ${state.store}` : ""}${state.minOff ? `, ${state.minOff}% off or more` : ""}.</p>` +
    `<div class="deals">${listPage(shown, deals.length)}</div>`;
  wireToolbar();
}

function wireToolbar() {
  const search = app.querySelector(".search-box");
  search.addEventListener("input", () => {
    state.query = search.value;
    renderList();
    const again = app.querySelector(".search-box");
    again.focus();
    again.setSelectionRange(again.value.length, again.value.length);
  });
  app.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.category;
      renderList();
    });
  });
  app.querySelectorAll("select[data-field]").forEach((select) => {
    select.addEventListener("change", () => {
      const field = select.dataset.field;
      state[field] = field === "minOff" ? Number(select.value) : select.value;
      renderList();
    });
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = found ? `${found.title} | DealHound` : "Not found | DealHound";
    app.innerHTML = found
      ? `<div class="detail"><a class="back-link" href="#/">← All deals</a>${dealPage(found)}</div>`
      : missingPage();
  } else {
    document.title = "DealHound — Black Friday Deal Finder";
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
