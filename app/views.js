// Amplop — one render function per hash route.
// ---- Shared computations (single source of truth: HOUSEHOLD data) ----

// All transactions of one month, oldest first.
function txnsForMonth(txns, month) {
  return txns.filter(function (t) { return t.date.indexOf(month) === 0; }).sort(function (a, b) {
    return a.date < b.date ? -1 : a.date > b.date ? 1 : a.id - b.id;
  });
}

// Income of one month from the seeded income lines.
function incomeForMonth(month) {
  return (HOUSEHOLD.income[month] || []).reduce(function (a, l) { return a + l.amount; }, 0);
}

// Spent per envelope id for one month, summed from the transactions.
function spentByEnvelope(txns, month) {
  const out = {};
  HOUSEHOLD.envelopes.forEach(function (e) { out[e.id] = 0; });
  txnsForMonth(txns, month).forEach(function (t) {
    if (t.type === 'expense' && t.env && out[t.env] !== undefined) out[t.env] += t.amount;
  });
  return out;
}

// Budget of one envelope in one month, honouring user edits (edits win).
function budgetFor(env, month, edits) {
  const key = month + ':' + env.id;
  if (edits && edits[key] !== undefined) return edits[key];
  return env.budget[month];
}

// Month totals: income, spent, budgeted, remaining, savings rate.
function monthTotals(month, txns, edits) {
  const income = incomeForMonth(month);
  const spentMap = spentByEnvelope(txns, month);
  let spent = 0, budget = 0;
  HOUSEHOLD.envelopes.forEach(function (e) {
    spent += spentMap[e.id];
    budget += budgetFor(e, month, edits);
  });
  return { income: income, spent: spent, budget: budget, remaining: income - spent, rate: income > 0 ? (income - spent) / income : 0 };
}

// Envelope rows for a month: budget, spent, remaining, over flag.
function envelopeRows(month, txns, edits) {
  const spentMap = spentByEnvelope(txns, month);
  return HOUSEHOLD.envelopes.map(function (e) {
    const budget = budgetFor(e, month, edits);
    const spent = spentMap[e.id];
    return { env: e, budget: budget, spent: spent, remaining: budget - spent, over: spent > budget };
  });
}

// Month picker: three buttons, the active one marked.
function monthPickerHTML(month) {
  return '<div class="month-picker" role="group" aria-label="Choose month">' +
    HOUSEHOLD.months.map(function (m) {
      return '<button type="button" class="month-btn' + (m === month ? ' active' : '') + '" data-month="' + m + '">' + monthShort(m) + ' ’26</button>';
    }).join('') + '</div>';
}

// Envelope name lookup for tables.
function envName(id) {
  const found = HOUSEHOLD.envelopes.filter(function (e) { return e.id === id; })[0];
  return found ? found.name : 'Income';
}

// ---- Dashboard ----

function viewDashboard(S) {
  const t = monthTotals(S.month, S.txns, S.budgetEdits);
  const rows = envelopeRows(S.month, S.txns, S.budgetEdits);
  const recent = txnsForMonth(S.txns, S.month).slice().sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id;
  }).slice(0, 8);
  const over = rows.filter(function (r) { return r.over; });
  const health = over.length
    ? 'Heads up: ' + over.map(function (r) { return r.env.name + ' is ' + money(r.spent - r.budget) + ' over its envelope'; }).join('; ') + '. Move money from an envelope with room to spare, or raise the budget.'
    : 'Every envelope is inside its budget this month. Nice and steady.';
  const incomeSeries = HOUSEHOLD.months.map(function (m) { return incomeForMonth(m); });
  const spentSeries = HOUSEHOLD.months.map(function (m) { return monthTotals(m, S.txns, S.budgetEdits).spent; });
  const cashflow = barChart(HOUSEHOLD.months.map(monthShort), [
    { label: 'Income', values: incomeSeries, color: '#5f7a54' },
    { label: 'Spent', values: spentSeries, color: '#b4552d' }
  ]);
  const incomeLines = (HOUSEHOLD.income[S.month] || []).map(function (l) {
    return l.source.split(' — ')[0] + ' ' + money(l.amount);
  }).join(' + ');
  return '' +
    '<section class="page-head"><div><h1>' + esc(monthLabel(S.month)) + ' at a glance</h1>' +
    '<p class="lede">' + esc(HOUSEHOLD.householdName) + ' — Ana, Marco, Leo &amp; Sofia. Every dollar has an envelope before the month begins.</p></div>' +
    monthPickerHTML(S.month) + '</section>' +
    '<section class="kpis">' +
    '<div class="kpi"><span class="kpi-label">Income</span><span class="kpi-num">' + money(t.income) + '</span><span class="kpi-sub">' + esc(incomeLines) + '</span></div>' +
    '<div class="kpi"><span class="kpi-label">Spent</span><span class="kpi-num">' + money(t.spent) + '</span><span class="kpi-sub">of ' + money(t.budget) + ' budgeted</span></div>' +
    '<div class="kpi good"><span class="kpi-label">Remaining</span><span class="kpi-num">' + money(t.remaining) + '</span><span class="kpi-sub">unspent income</span></div>' +
    '<div class="kpi good"><span class="kpi-label">Savings rate</span><span class="kpi-num">' + pct(t.rate) + '</span><span class="kpi-sub">of income kept this month</span></div>' +
    '</section>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Cash flow — three months</h2>' + cashflow +
    '<p class="chart-key"><span><i class="sw" style="background:#5f7a54"></i>Income</span><span><i class="sw" style="background:#b4552d"></i>Spent</span></p></div>' +
    '<div class="card"><h2>Envelopes — ' + esc(monthLabel(S.month)) + '</h2>' +
    rows.map(function (r) {
      return '<div class="env-row"><span class="env-name">' + esc(r.env.name) + '</span>' +
        '<span class="env-nums">' + money(r.spent) + ' of ' + money(r.budget) + '</span>' +
        progressBar(r.spent, r.budget, r.env.color) + '</div>';
    }).join('') +
    '<p class="more-link"><a href="#/envelopes">Manage envelopes →</a></p></div>' +
    '</section>' +
    '<section class="card"><h2>Latest transactions</h2>' +
    '<table class="tx-table"><thead><tr><th>Date</th><th>Description</th><th>Envelope</th><th class="num">Amount</th></tr></thead><tbody>' +
    recent.map(function (tx) {
      return '<tr><td>' + fmtDate(tx.date) + '</td><td>' + esc(tx.desc) + '</td><td>' + esc(tx.type === 'income' ? 'Income' : envName(tx.env)) + '</td><td class="num ' + tx.type + '">' + (tx.type === 'income' ? '+' : '−') + moneyExact(tx.amount) + '</td></tr>';
    }).join('') + '</tbody></table>' +
    '<p class="more-link"><a href="#/transactions">See all transactions →</a></p></section>' +
    '<section class="note"><strong>Budget health:</strong> ' + esc(health) + '</section>';
}

// ---- Transactions ----

function viewTransactions(S) {
  const monthTx = txnsForMonth(S.txns, S.month);
  const q = (S.search || '').toLowerCase();
  const filtered = monthTx.filter(function (t) {
    const inEnv = !S.filterEnv || S.filterEnv === 'all' || (S.filterEnv === 'income' ? t.type === 'income' : t.env === S.filterEnv);
    const inQ = !q || t.desc.toLowerCase().indexOf(q) !== -1;
    return inEnv && inQ;
  });
  // Running balance across the month, oldest first.
  let balance = 0;
  const withBalance = filtered.slice().sort(function (a, b) {
    return a.date < b.date ? -1 : a.date > b.date ? 1 : a.id - b.id;
  }).map(function (t) {
    balance += t.type === 'income' ? t.amount : -t.amount;
    return { t: t, balance: balance };
  }).reverse();
  const spentShown = filtered.filter(function (t) { return t.type === 'expense'; }).reduce(function (a, t) { return a + t.amount; }, 0);
  const chips = ['all', 'income'].concat(HOUSEHOLD.envelopes.map(function (e) { return e.id; }));
  return '' +
    '<section class="page-head"><div><h1>Transactions</h1>' +
    '<p class="lede">' + monthTx.length + ' entries in ' + esc(monthLabel(S.month)) + ' — ' + money(spentShown) + ' spent in the current view.</p></div>' +
    monthPickerHTML(S.month) + '</section>' +
    '<section class="card"><div class="tx-tools">' +
    '<input id="tx-search" type="search" placeholder="Search descriptions…" value="' + esc(S.search || '') + '" aria-label="Search transactions">' +
    '<div class="chips" role="group" aria-label="Filter by envelope">' +
    chips.map(function (c) {
      const label = c === 'all' ? 'All' : c === 'income' ? 'Income' : envName(c);
      return '<button type="button" class="chip' + ((S.filterEnv || 'all') === c ? ' active' : '') + '" data-filter="' + c + '">' + esc(label) + '</button>';
    }).join('') + '</div></div>' +
    '<table class="tx-table"><thead><tr><th>Date</th><th>Description</th><th>Envelope</th><th class="num">Amount</th><th class="num">Balance</th><th></th></tr></thead><tbody>' +
    (withBalance.length ? withBalance.map(function (row) {
      const t = row.t;
      return '<tr><td>' + fmtDate(t.date) + '</td><td>' + esc(t.desc) + '</td><td>' + esc(t.type === 'income' ? 'Income' : envName(t.env)) + '</td>' +
        '<td class="num ' + t.type + '">' + (t.type === 'income' ? '+' : '−') + moneyExact(t.amount) + '</td>' +
        '<td class="num">' + moneyExact(row.balance) + '</td>' +
        '<td><button type="button" class="del" data-del="' + t.id + '" aria-label="Delete ' + esc(t.desc) + '">Delete</button></td></tr>';
    }).join('') : '<tr><td colspan="6" class="empty">Nothing matches — clear the search or pick another envelope.</td></tr>') +
    '</tbody></table></section>' +
    '<section class="card"><h2>Add a transaction</h2>' +
    '<form id="tx-form" class="form-grid">' +
    '<label>Date<input id="tx-date" type="date" value="' + S.month + '-28" required></label>' +
    '<label>Description<input id="tx-desc" type="text" placeholder="e.g. Weekly shop — GreenMart" required maxlength="80"></label>' +
    '<label>Envelope<select id="tx-env">' + HOUSEHOLD.envelopes.map(function (e) { return '<option value="' + e.id + '">' + esc(e.name) + '</option>'; }).join('') + '</select></label>' +
    '<label>Type<select id="tx-type"><option value="expense">Expense</option><option value="income">Income</option></select></label>' +
    '<label>Amount (USD)<input id="tx-amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>' +
    '<button type="submit" class="btn primary">Add transaction</button>' +
    '</form><p class="hint">New entries appear in the table at once, and every total on the site updates — income entries go to “Income”, not to an envelope.</p></section>';
}

// ---- Envelopes ----

function viewEnvelopes(S) {
  const rows = envelopeRows(S.month, S.txns, S.budgetEdits);
  const t = monthTotals(S.month, S.txns, S.budgetEdits);
  return '' +
    '<section class="page-head"><div><h1>Envelopes</h1>' +
    '<p class="lede">One envelope per kind of spending. Budgeted ' + money(t.budget) + ' for ' + esc(monthLabel(S.month)) + '; ' + money(t.spent) + ' spent so far.</p></div>' +
    monthPickerHTML(S.month) + '</section>' +
    '<section class="env-grid">' +
    rows.map(function (r) {
      return '<article class="card env-card"><div class="env-top"><span class="env-dot" style="background:' + esc(r.env.color) + '"></span><h2>' + esc(r.env.name) + '</h2></div>' +
        '<p class="env-big">' + money(r.spent) + ' <span>of ' + money(r.budget) + '</span></p>' +
        progressBar(r.spent, r.budget, r.env.color) +
        '<p class="env-status ' + (r.over ? 'over' : 'ok') + '">' + (r.over ? money(r.spent - r.budget) + ' over budget' : money(r.remaining) + ' left') + '</p>' +
        '<p class="env-note">' + esc(r.env.note) + '</p>' +
        '<form class="env-edit" data-env="' + r.env.id + '"><label>Monthly budget $<input type="number" min="0" step="1" value="' + r.budget + '" aria-label="Budget for ' + esc(r.env.name) + '"></label>' +
        '<button type="submit" class="btn">Save budget</button></form></article>';
    }).join('') + '</section>' +
    '<section class="note"><strong>Rollover:</strong> money left in an envelope at month’s end rolls into next month’s same envelope — it is not lost, and it is not free spending either. That is the whole trick of the envelope method: the budget is a plan, not a punishment.</section>';
}

// ---- Goals ----

function viewGoals(S) {
  const totalSaved = S.goals.reduce(function (a, g) { return a + g.saved; }, 0);
  const totalTarget = S.goals.reduce(function (a, g) { return a + g.target; }, 0);
  return '' +
    '<section class="page-head"><div><h1>Savings goals</h1>' +
    '<p class="lede">' + money(totalSaved) + ' saved towards ' + money(totalTarget) + ' of goals — ' + pct(totalTarget > 0 ? totalSaved / totalTarget : 0) + ' of the way there.</p></div></section>' +
    '<section class="env-grid">' +
    S.goals.map(function (g) {
      const left = Math.max(0, g.target - g.saved);
      return '<article class="card env-card"><div class="env-top"><span class="env-dot" style="background:#5f7a54"></span><h2>' + esc(g.name) + '</h2></div>' +
        '<p class="env-big">' + money(g.saved) + ' <span>of ' + money(g.target) + '</span></p>' +
        progressBar(g.saved, g.target, '#5f7a54') +
        '<p class="env-status ' + (left === 0 ? 'ok' : '') + '">' + (left === 0 ? 'Goal reached!' : money(left) + ' to go · ' + pct(g.target > 0 ? g.saved / g.target : 0)) + '</p>' +
        '<p class="env-note">' + esc(g.note) + '</p>' +
        '<form class="goal-add" data-goal="' + g.id + '"><label>Add $<input type="number" min="1" step="1" placeholder="50" aria-label="Contribution to ' + esc(g.name) + '"></label>' +
        '<button type="submit" class="btn">Add to goal</button></form></article>';
    }).join('') + '</section>' +
    '<section class="card"><h2>Start a new goal</h2>' +
    '<form id="goal-form" class="form-grid">' +
    '<label>Goal name<input id="goal-name" type="text" placeholder="e.g. New bikes for the kids" required maxlength="60"></label>' +
    '<label>Target (USD)<input id="goal-target" type="number" min="1" step="1" placeholder="500" required></label>' +
    '<button type="submit" class="btn primary">Create goal</button>' +
    '</form><p class="hint">A goal starts at $0 saved. Add contributions any time; the progress bar and the totals above move with it.</p></section>';
}

// ---- Bill splitter ----

function viewSplit(S) {
  const sp = S.split;
  const total = sp.shares.reduce(function (a, s) { return a + s; }, 0);
  const amount = sp.amount || 0;
  const rows = HOUSEHOLD.members.map(function (name, i) {
    const share = sp.shares[i] || 0;
    const owes = amount * share / 100;
    return '<div class="split-row"><label class="split-member"><input type="checkbox" data-member="' + i + '"' + (sp.active[i] ? ' checked' : '') + '> ' + esc(name) + '</label>' +
      '<label class="split-share">Share %<input type="number" min="0" max="100" step="1" value="' + share + '" data-share="' + i + '"' + (sp.active[i] ? '' : ' disabled') + '></label>' +
      '<span class="split-owes">' + moneyExact(owes) + '</span></div>';
  }).join('');
  return '' +
    '<section class="page-head"><div><h1>Split a bill</h1>' +
    '<p class="lede">One bill, four people, no arguments. Set each person’s share and the split updates as you type.</p></div></section>' +
    '<section class="grid-2"><div class="card"><h2>The bill</h2>' +
    '<form id="split-form" class="form-grid">' +
    '<label>What is it?<input id="split-name" type="text" value="' + esc(sp.name || '') + '" placeholder="e.g. Electricity bill" maxlength="60"></label>' +
    '<label>Amount (USD)<input id="split-amount" type="number" min="0" step="0.01" value="' + (sp.amount || '') + '" placeholder="0.00"></label>' +
    '</form>' +
    '<p class="hint">Presets:</p><div class="chips">' +
    HOUSEHOLD.splitPresets.map(function (p) {
      return '<button type="button" class="chip preset" data-preset-amount="' + p.amount + '" data-preset-name="' + esc(p.name) + '">' + esc(p.name) + ' · ' + money(p.amount) + '</button>';
    }).join('') + '</div>' +
    '<button type="button" class="btn" id="split-equal">Split equally</button> ' +
    '<span class="hint" id="share-note">Shares add up to ' + total + '% — ' + (total === 100 ? 'ready to settle.' : total > 100 ? 'over 100%! Trim a share.' : 'under 100% — ' + (100 - total) + '% unassigned.') + '</span>' +
    '</div>' +
    '<div class="card"><h2>Who owes what</h2>' + rows +
    '<p class="split-total">Bill total: <strong>' + moneyExact(amount) + '</strong> · Assigned: <strong>' + moneyExact(amount * total / 100) + '</strong></p>' +
    '<p class="hint">Uncheck someone to take them out of the split; their share is set to 0. “Split equally” divides 100% across everyone checked.</p></div>' +
    '</section>';
}

// ---- Reports ----

function viewReports(S) {
  const months = HOUSEHOLD.months;
  const incomeSeries = months.map(function (m) { return incomeForMonth(m); });
  const spentSeries = months.map(function (m) { return monthTotals(m, S.txns, S.budgetEdits).spent; });
  const spentMap = spentByEnvelope(S.txns, S.month);
  const parts = HOUSEHOLD.envelopes.map(function (e) {
    return { label: e.name, value: spentMap[e.id], color: e.color };
  }).filter(function (p) { return p.value > 0; });
  const rows = envelopeRows(S.month, S.txns, S.budgetEdits);
  const biggest = rows.slice().sort(function (a, b) { return b.spent - a.spent; })[0];
  const over = rows.filter(function (r) { return r.over; });
  const sep = monthTotals('2026-09', S.txns, S.budgetEdits);
  const oct = monthTotals('2026-10', S.txns, S.budgetEdits);
  const nov = monthTotals('2026-11', S.txns, S.budgetEdits);
  const ytdIncome = sep.income + oct.income + nov.income;
  const ytdSpent = sep.spent + oct.spent + nov.spent;
  const change = oct.spent > 0 ? (nov.spent - oct.spent) / oct.spent : 0;
  const insights = [
    'Biggest envelope in ' + monthLabel(S.month) + ': ' + biggest.env.name + ' at ' + money(biggest.spent) + ' — ' + pct(biggest.spent / nov.spent) + ' of all spending.',
    over.length
      ? over.map(function (r) { return r.env.name + ' ran ' + money(r.spent - r.budget) + ' (' + pct((r.spent - r.budget) / r.budget) + ') over its ' + money(r.budget) + ' envelope'; }).join('; ') + '.'
      : 'No envelope went over budget in ' + monthLabel(S.month) + '.',
    'Spending ' + (change >= 0 ? 'rose ' : 'fell ') + pct(Math.abs(change)) + ' from October (' + money(oct.spent) + ') to November (' + money(nov.spent) + ').',
    'Rent & Utilities is the fixed anchor: ' + money(1850) + ' every month, ' + pct(1850 / nov.spent) + ' of November spending.',
    'Savings rate is climbing with income: Sep ' + pct(sep.rate) + ' → Oct ' + pct(oct.rate) + ' → Nov ' + pct(nov.rate) + '.'
  ];
  return '' +
    '<section class="page-head"><div><h1>Reports</h1>' +
    '<p class="lede">Three months of the Alvarez household, side by side. Everything here is computed from the same transactions as the other pages.</p></div>' +
    monthPickerHTML(S.month) + '</section>' +
    '<section class="grid-2">' +
    '<div class="card"><h2>Income vs spent — Sep to Nov</h2>' + barChart(months.map(monthShort), [
      { label: 'Income', values: incomeSeries, color: '#5f7a54' },
      { label: 'Spent', values: spentSeries, color: '#b4552d' }
    ]) + '<p class="chart-key"><span><i class="sw" style="background:#5f7a54"></i>Income</span><span><i class="sw" style="background:#b4552d"></i>Spent</span></p></div>' +
    '<div class="card"><h2>Where November went</h2><div class="donut-wrap">' + donutChart(parts) + donutLegend(parts) + '</div></div>' +
    '</section>' +
    '<section class="card"><h2>What the numbers say</h2><ul class="insights">' +
    insights.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></section>' +
    '<section class="card"><h2>Year to date — Sep to Nov 2026</h2>' +
    '<table class="tx-table"><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Remaining</th><th class="num">Savings rate</th></tr></thead><tbody>' +
    [sep, oct, nov].map(function (t, i) {
      return '<tr><td>' + esc(monthLabel(months[i])) + '</td><td class="num">' + money(t.income) + '</td><td class="num">' + money(t.spent) + '</td><td class="num">' + money(t.remaining) + '</td><td class="num">' + pct(t.rate) + '</td></tr>';
    }).join('') +
    '<tr class="total-row"><td>Total</td><td class="num">' + money(ytdIncome) + '</td><td class="num">' + money(ytdSpent) + '</td><td class="num">' + money(ytdIncome - ytdSpent) + '</td><td class="num">' + pct((ytdIncome - ytdSpent) / ytdIncome) + '</td></tr>' +
    '</tbody></table></section>';
}

// ---- About ----

function viewAbout() {
  return '' +
    '<section class="page-head"><div><h1>About Amplop</h1>' +
    '<p class="lede">A household budget site built on the envelope method — and on real, checkable numbers.</p></div></section>' +
    '<section class="card narrow"><h2>The envelope method, in five steps</h2>' +
    '<ol class="steps">' +
    '<li><strong>Add up the month’s income</strong> before it begins. Here: Ana’s and Marco’s salaries plus weekend repair work.</li>' +
    '<li><strong>Give every dollar a job.</strong> Rent, groceries, transport, dining out, kids, fun, health, household — each gets an envelope with a fixed budget. Income minus envelopes should land near zero.</li>' +
    '<li><strong>Spend only from the envelope.</strong> When the grocery envelope is empty, the month’s grocery shopping is done — borrow from another envelope deliberately, never by accident.</li>' +
    '<li><strong>Roll leftovers forward.</strong> Money left in an envelope at month’s end stays in that envelope next month.</li>' +
    '<li><strong>Save first, not last.</strong> The “remaining” line is the savings rate. This household keeps about a third of its income.</li>' +
    '</ol></section>' +
    '<section class="card narrow"><h2>About the numbers</h2>' +
    '<p>The Alvarez household is fictional. Every figure on this site comes from one seeded data set covering September, October and November 2026 — 122 transactions, eight envelopes and four savings goals. Dashboard, envelopes and reports all sum the same transactions, so the numbers always agree with each other. Change anything (add a transaction, edit a budget, fund a goal) and every page updates, because there is only one source of truth.</p>' +
    '<p>Changes you make are saved in your own browser (local storage) and never leave your device. Nothing on this site talks to a server: no accounts, no tracking, no network requests at all.</p></section>' +
    '<section class="card narrow"><h2>About this site</h2>' +
    '<p>Amplop is a static site: plain HTML, CSS and JavaScript, hand-rolled SVG charts, no framework and no web fonts. It works offline from its own files, on a desktop and on a phone. Built for the make.fun competition “Make the best household budget site”.</p></section>';
}

// ---- Dispatcher ----

function renderRoute(route, S) {
  if (route === 'transactions') return viewTransactions(S);
  if (route === 'envelopes') return viewEnvelopes(S);
  if (route === 'goals') return viewGoals(S);
  if (route === 'split') return viewSplit(S);
  if (route === 'reports') return viewReports(S);
  if (route === 'about') return viewAbout();
  return viewDashboard(S);
}
