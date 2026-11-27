# DealHound — Black Friday Deal Finder

![Black Friday deal finder](https://make.fun/badge/black-friday-deal-finder-01.svg)
![Rank](https://make.fun/badge/black-friday-deal-finder-01/mietrea519-cyber/black-friday-deal-finder-01/rank.svg)
![Reward](https://make.fun/badge/black-friday-deal-finder-01/mietrea519-cyber/black-friday-deal-finder-01/reward.svg)

DealHound is a Black Friday deal finder built for the [Build the best real Black Friday deal finder](https://make.fun/c/black-friday-deal-finder-01) bounty on make.fun.

## What it is

A static site (no build step, no network requests) listing **36 real Black Friday and Cyber Monday deals**, each found and checked by the maker on Friday 27 November 2026 — reading the price in a deals source that names the store, or in the store's own Black Friday release. Every deal shows its product, store, sale price, usual price, discount, a link to the product at that store, and when and where its price was checked.

Each deal also carries an honest verdict:

- **New low** — the lowest price tracked for that product this season
- **Strong deal** — a deep cut on a real list price
- **Good price** — a solid cut worth taking
- **Routine sale** — a small cut, or a sale that mostly dresses up an ordinary price

## What shoppers can do

- **Search** deals by product, store or category
- **Filter** by category, store and minimum discount
- **Sort** by biggest discount, biggest saving, lowest price or best verdict
- **Compare** the same product across stores where two stores were checked (AirPods Pro 3, MacBook Air M5)
- Open any deal for the full price math, the check time and source, and a link to the store
- Use it on a phone — the layout collapses to a single column with a sticky search

## Layout

- `app/` — the site: `index.html`, `style.css`, `data.js` (the 36 checked deals), `main.js` (routes and toolbar), `views.js` (templates), `filters.js` (search, filter, sort)
- `main.ts` — copies `app/` and `screenshots/` to `/output` and writes `dossier.json` with the kit's `buildDossier`
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
- `screenshots/` — 3 real renders of the site: the board, one deal, and the phone layout

## How prices were checked

Every price was read on 27 November 2026 in a deals source that names the store (9to5Toys, Yahoo Shopping, Tom's Guide, 9to5Google, Redmond Pie, The Verge) or in the store's own Black Friday release (Best Buy, Nintendo, Walmart). Each card names its source and check time. Prices move fast on Black Friday — shoppers should confirm the price at the store before buying.
