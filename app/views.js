// Templates for the list and the deal page. Every number on a card comes
// straight from data.js, so the price, the usual price and the discount
// always agree with each other.

import { deals } from "./data.js";

export const VERDICT_LABEL = {
  "new-low": "New low",
  strong: "Strong deal",
  good: "Good price",
  routine: "Routine sale",
};

export function money(value) {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

export function discountOf(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function saveOf(deal) {
  return deal.was - deal.price;
}

export function artClass(category) {
  return category.toLowerCase().replace(/[^a-z]+/g, "-");
}

export function monogram(title) {
  const words = title.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean);
  return (words[0]?.[0] ?? "D") + (words[1]?.[0] ?? words[0]?.[1] ?? "");
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function checkedLine(deal) {
  const day = deal.checked.slice(0, 10);
  const time = deal.checked.slice(11, 16);
  return `Checked ${day} ${time} UTC · ${esc(deal.source)}`;
}

export function card(deal) {
  const off = discountOf(deal);
  const unit = deal.unit ? `<small>${esc(deal.unit)}</small>` : "";
  const also = deal.alsoAt
    ? `<span class="also">Also at ${esc(deal.alsoAt.store)} for ${money(deal.alsoAt.price)}${unit}</span>`
    : "";
  return `<a class="deal-card" href="#/deal/${deal.id}">
    <div class="deal-art ${artClass(deal.category)}" aria-hidden="true">${esc(monogram(deal.title))}</div>
    <div class="deal-body">
      <div class="deal-top"><span class="store">${esc(deal.store)}</span><span>${esc(deal.category)}</span></div>
      <h2 class="deal-title">${esc(deal.title)}</h2>
      <div class="price-row">
        <span class="price-now">${money(deal.price)}${unit}</span>
        <span class="price-was">${money(deal.was)}${unit}</span>
        <span class="price-off">−${off}%</span>
        <span class="price-save">save ${money(saveOf(deal))}</span>
      </div>
      <span class="verdict ${deal.verdict}">${VERDICT_LABEL[deal.verdict]}</span>
      <p class="evidence">${esc(deal.evidence)}</p>
      <p class="deal-meta">${checkedLine(deal)}${also}</p>
    </div>
  </a>`;
}

export function listPage(shown, total) {
  if (!shown.length) {
    return `<p class="empty">No deals match that search. Try a different word, store or category.</p>`;
  }
  return shown.map(card).join("");
}

export function dealPage(deal) {
  const off = discountOf(deal);
  const unit = deal.unit ? `<small>${esc(deal.unit)}</small>` : "";
  const compare = deal.alsoAt
    ? `<p class="compare"><b>Same product, another store:</b> ${esc(deal.alsoAt.store)} has it for ${money(deal.alsoAt.price)}${unit} — ${deal.alsoAt.price <= deal.price ? "that beats this price" : "this card is the cheaper of the two"}.</p>`
    : `<p class="compare"><b>No second store found:</b> no other store we checked had this exact product on sale today, so there is nothing honest to compare it with.</p>`;
  return `<div class="detail-card">
    <div class="deal-art ${artClass(deal.category)}" aria-hidden="true">${esc(monogram(deal.title))}</div>
    <div class="detail-body">
      <div class="deal-top"><span class="store">${esc(deal.store)}</span><span>${esc(deal.category)}</span></div>
      <h1>${esc(deal.title)}</h1>
      <div class="price-row">
        <span class="price-now">${money(deal.price)}${unit}</span>
        <span class="price-was">${money(deal.was)}${unit}</span>
        <span class="price-off">−${off}%</span>
        <span class="price-save">save ${money(saveOf(deal))}</span>
      </div>
      <span class="verdict ${deal.verdict}">${VERDICT_LABEL[deal.verdict]}</span>
      <p class="evidence">${esc(deal.evidence)}</p>
      <dl class="detail-rows">
        <div><dt>Store</dt><dd>${esc(deal.store)}</dd></div>
        <div><dt>Category</dt><dd>${esc(deal.category)}</dd></div>
        <div><dt>Sale price</dt><dd>${money(deal.price)}${unit}</dd></div>
        <div><dt>Usual price</dt><dd>${money(deal.was)}${unit}</dd></div>
        <div><dt>Discount</dt><dd>${off}% off — save ${money(saveOf(deal))}</dd></div>
        <div><dt>Price checked</dt><dd>${deal.checked.slice(0, 10)} ${deal.checked.slice(11, 16)} UTC</dd></div>
        <div><dt>Read at</dt><dd>${esc(deal.source)}</dd></div>
        <div><dt>Verdict</dt><dd>${VERDICT_LABEL[deal.verdict]}</dd></div>
      </dl>
      ${compare}
      <p class="detail-note">Prices move fast on Black Friday. This price was read at the source above on the day shown; confirm it at the store before you buy, and check the store's return and delivery terms.</p>
      <a class="store-link" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} ↗</a>
    </div>
  </div>`;
}

export function missingPage() {
  return `<div class="detail"><p class="empty">That deal is not on the board. <a href="#/">Back to all deals</a>.</p></div>`;
}

export function statsBlock(list) {
  const total = deals.length;
  const offs = list.map(discountOf);
  const best = Math.max(...offs);
  const avg = Math.round(offs.reduce((a, b) => a + b, 0) / Math.max(1, offs.length));
  const newLows = list.filter((d) => d.verdict === "new-low").length;
  return `<section class="stats" aria-label="Board totals">
    <div class="stat"><b>${total}</b><span>deals checked</span></div>
    <div class="stat"><b>${avg}%</b><span>average discount</span></div>
    <div class="stat"><b>${best}%</b><span>biggest cut</span></div>
    <div class="stat"><b>${newLows}</b><span>new lows</span></div>
  </section>`;
}
