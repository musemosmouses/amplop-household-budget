# Amplop — Household Budget, Envelope Method

A household budget site for a fictional family, the Alvarez household
(November 2026, USD), built on the envelope method: every dollar of income
is assigned to a named envelope before the month begins, and spending is
tracked envelope by envelope.

## What it does

- **Dashboard** — month picker (Sep / Oct / Nov 2026), income / spent /
  remaining / savings-rate cards, cash-flow chart, envelope progress, latest
  transactions, and a budget-health note computed from the data.
- **Transactions** — full table with search and category filters, an add
  form that really adds a row and updates every total, and delete per row.
- **Envelopes** — one card per envelope with budgeted vs spent, a progress
  bar and remaining amount; edit any budget and watch the totals move.
- **Goals** — savings goals with progress bars; add a contribution or create
  a new goal.
- **Split** — a bill splitter for the four household members with custom
  shares, plus preset bills that fill the form.
- **Reports** — monthly income-vs-spent bars, a spending-share donut, top
  spending insights computed from the data, and year-to-date totals.
- **About** — how envelope budgeting works and notes on the demo data.

All figures come from one seeded data set (three months, Sep–Nov 2026) and
every view computes from that same data, so the numbers always agree.
Changes you make (new transactions, edited budgets, goal contributions)
are kept in your browser's local storage and survive a reload.

## Run it

Serve `app/` with any static server and open `index.html`, for example:

```
node serve-test.mjs   # serves repo/app/ at http://localhost:8080
```

No build step, no network requests, no framework — plain HTML, CSS and
JavaScript with hand-rolled SVG charts. Works on desktop and on a phone.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into the output directory and writes `dossier.json` with `buildDossier`
from `vendor/makefun-frontend.ts`:

```
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built for the make.fun competition
`best-household-budget-site-20261126-1457` ("Make the best household budget
site"). All data is fictional demo data for the Alvarez household.
