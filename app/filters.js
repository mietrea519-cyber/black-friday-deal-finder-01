// Search, filters and sorting for the board. One pure function per job so
// each can be read on its own: match the text, pass the filters, order the
// result. All state lives in one small object the page hands around.

import { deals } from "./data.js";
import { discountOf, saveOf } from "./views.js";

export const VERDICT_RANK = { "new-low": 0, strong: 1, good: 2, routine: 3 };

export function categories() {
  return [...new Set(deals.map((d) => d.category))].sort();
}

export function stores() {
  return [...new Set(deals.map((d) => d.store))].sort();
}

export function blankState() {
  return { query: "", category: "All", store: "All", minOff: 0, sort: "discount" };
}

function matchesText(deal, query) {
  if (!query) return true;
  const hay = `${deal.title} ${deal.store} ${deal.category}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => hay.includes(word));
}

function passesFilters(deal, state) {
  if (state.category !== "All" && deal.category !== state.category) return false;
  if (state.store !== "All" && deal.store !== state.store) return false;
  if (discountOf(deal) < state.minOff) return false;
  return true;
}

const SORTERS = {
  discount: (a, b) => discountOf(b) - discountOf(a) || saveOf(b) - saveOf(a),
  saving: (a, b) => saveOf(b) - saveOf(a) || discountOf(b) - discountOf(a),
  price: (a, b) => a.price - b.price || discountOf(b) - discountOf(a),
  verdict: (a, b) =>
    VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || discountOf(b) - discountOf(a),
};

export function applyFilters(state) {
  const shown = deals.filter((d) => matchesText(d, state.query) && passesFilters(d, state));
  shown.sort(SORTERS[state.sort] ?? SORTERS.discount);
  return shown;
}
