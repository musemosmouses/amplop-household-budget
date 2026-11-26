// Amplop — hash router, month state, and every control's wiring.
// ---- State: seed data + the user's own changes on top ----

var STORE_KEY = 'amplop-v1';
var memoryStore = null; // in-memory fallback when localStorage is unavailable

function storeRead() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return memoryStore;
  }
}

function storeWrite(data) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    memoryStore = data; // private mode / disabled storage: keep it in memory
  }
}

function cloneGoal(g) {
  return { id: g.id, name: g.name, target: g.target, saved: g.saved, note: g.note };
}

function loadState() {
  const saved = storeRead() || {};
  const added = saved.added || [];
  const deleted = saved.deleted || [];
  const budgetEdits = saved.budgetEdits || {};
  const goalAdds = saved.goalAdds || {};
  const newGoals = saved.newGoals || [];
  const txns = HOUSEHOLD.transactions.filter(function (t) { return deleted.indexOf(t.id) === -1; }).concat(added);
  const goals = HOUSEHOLD.goals.map(function (g) {
    const c = cloneGoal(g);
    if (goalAdds[g.id]) c.saved += goalAdds[g.id];
    return c;
  }).concat(newGoals.map(function (g) {
    const c = cloneGoal(g);
    if (goalAdds[g.id]) c.saved += goalAdds[g.id];
    return c;
  }));
  let maxId = 0;
  txns.forEach(function (t) { if (t.id > maxId) maxId = t.id; });
  return {
    month: HOUSEHOLD.currentMonth,
    txns: txns,
    budgetEdits: budgetEdits,
    goals: goals,
    search: '',
    filterEnv: 'all',
    split: { name: '', amount: 0, shares: [25, 25, 25, 25], active: [true, true, true, true] },
    nextId: Math.max(maxId + 1, 1000), // user-added rows live at id >= 1000, so seed rows stay deletable by id
    saved: saved
  };
}

var App = loadState();

function persist() {
  const s = App.saved;
  s.added = App.txns.filter(function (t) { return t.id >= 1000; });
  s.deleted = (s.deleted || []).slice();
  s.budgetEdits = App.budgetEdits;
  s.goalAdds = s.goalAdds || {};
  s.newGoals = App.goals.filter(function (g) { return g.id.indexOf('goal-') === 0; });
  storeWrite(s);
}

// ---- Router ----

var ROUTES = {
  '': { name: 'dashboard', title: 'Dashboard' },
  '/': { name: 'dashboard', title: 'Dashboard' },
  '/transactions': { name: 'transactions', title: 'Transactions' },
  '/envelopes': { name: 'envelopes', title: 'Envelopes' },
  '/goals': { name: 'goals', title: 'Savings goals' },
  '/split': { name: 'split', title: 'Split a bill' },
  '/reports': { name: 'reports', title: 'Reports' },
  '/about': { name: 'about', title: 'About' }
};

function currentRoute() {
  const hash = window.location.hash || '#/';
  const key = hash.slice(1);
  return (ROUTES[key] || ROUTES['/']).name;
}

function render() {
  const route = currentRoute();
  const view = document.getElementById('view');
  view.innerHTML = renderRoute(route, App);
  const titles = { dashboard: 'Dashboard', transactions: 'Transactions', envelopes: 'Envelopes', goals: 'Savings goals', split: 'Split a bill', reports: 'Reports', about: 'About' };
  document.title = 'Amplop — ' + (titles[route] || 'Dashboard') + ' | Household Budget';
  document.querySelectorAll('.nav a').forEach(function (a) {
    const r = a.getAttribute('href').replace('#/', '') || 'dashboard';
    a.classList.toggle('active', r === route);
  });
  const search = document.getElementById('tx-search');
  if (search && App.search) { search.value = App.search; }
}

window.addEventListener('hashchange', render);

// ---- Controls: one delegated listener for the whole view ----

document.getElementById('view').addEventListener('click', function (ev) {
  const monthBtn = ev.target.closest('[data-month]');
  if (monthBtn) {
    App.month = monthBtn.getAttribute('data-month');
    render();
    return;
  }
  const chip = ev.target.closest('[data-filter]');
  if (chip) {
    App.filterEnv = chip.getAttribute('data-filter');
    render();
    return;
  }
  const del = ev.target.closest('[data-del]');
  if (del) {
    const id = Number(del.getAttribute('data-del'));
    const idx = App.txns.findIndex(function (t) { return t.id === id; });
    if (idx !== -1) {
      const removed = App.txns[idx];
      App.txns.splice(idx, 1);
      if (removed.id < 1000) {
        App.saved.deleted = App.saved.deleted || [];
        if (App.saved.deleted.indexOf(id) === -1) App.saved.deleted.push(id);
      }
      persist();
      render();
    }
    return;
  }
  const preset = ev.target.closest('[data-preset-amount]');
  if (preset) {
    App.split.name = preset.getAttribute('data-preset-name') || '';
    App.split.amount = Number(preset.getAttribute('data-preset-amount')) || 0;
    render();
    return;
  }
  if (ev.target.closest('#split-equal')) {
    const activeIdx = App.split.active.map(function (on, i) { return on ? i : -1; }).filter(function (i) { return i !== -1; });
    const n = activeIdx.length || 1;
    App.split.shares = App.split.shares.map(function () { return 0; });
    activeIdx.forEach(function (i, k) {
      App.split.shares[i] = k === 0 ? 100 - Math.floor(100 / n) * (n - 1) : Math.floor(100 / n);
    });
    render();
  }
});

document.getElementById('view').addEventListener('input', function (ev) {
  if (ev.target.id === 'tx-search') {
    App.search = ev.target.value;
    applyTxFilter();
    return;
  }
  if (ev.target.id === 'split-amount') {
    App.split.amount = Number(ev.target.value) || 0;
    updateSplitLive();
    return;
  }
  if (ev.target.id === 'split-name') {
    App.split.name = ev.target.value;
    return;
  }
  const shareInput = ev.target.closest('[data-share]');
  if (shareInput) {
    App.split.shares[Number(shareInput.getAttribute('data-share'))] = Number(shareInput.value) || 0;
    updateSplitLive();
    return;
  }
  const memberBox = ev.target.closest('[data-member]');
  if (memberBox) {
    const i = Number(memberBox.getAttribute('data-member'));
    App.split.active[i] = memberBox.checked;
    if (!memberBox.checked) App.split.shares[i] = 0;
    render();
  }
});

document.getElementById('view').addEventListener('submit', function (ev) {
  ev.preventDefault();
  const form = ev.target;
  if (form.id === 'tx-form') {
    const amount = Number(document.getElementById('tx-amount').value);
    const desc = document.getElementById('tx-desc').value.trim();
    const date = document.getElementById('tx-date').value;
    const type = document.getElementById('tx-type').value;
    const env = type === 'income' ? null : document.getElementById('tx-env').value;
    if (!desc || !date || !(amount > 0)) return;
    App.txns.push({ id: App.nextId++, date: date, desc: desc, env: env, amount: Math.round(amount * 100) / 100, type: type });
    App.month = date.slice(0, 7);
    if (HOUSEHOLD.months.indexOf(App.month) === -1) App.month = HOUSEHOLD.currentMonth;
    persist();
    render();
    return;
  }
  if (form.classList.contains('env-edit')) {
    const envId = form.getAttribute('data-env');
    const input = form.querySelector('input[type=number]');
    const val = Number(input.value);
    if (val >= 0) {
      App.budgetEdits[App.month + ':' + envId] = Math.round(val);
      persist();
      render();
    }
    return;
  }
  if (form.classList.contains('goal-add')) {
    const goalId = form.getAttribute('data-goal');
    const input = form.querySelector('input[type=number]');
    const val = Number(input.value);
    const goal = App.goals.filter(function (g) { return g.id === goalId; })[0];
    if (goal && val > 0) {
      goal.saved = Math.round((goal.saved + val) * 100) / 100;
      App.saved.goalAdds = App.saved.goalAdds || {};
      App.saved.goalAdds[goalId] = (App.saved.goalAdds[goalId] || 0) + val;
      persist();
      render();
    }
    return;
  }
  if (form.id === 'goal-form') {
    const name = document.getElementById('goal-name').value.trim();
    const target = Number(document.getElementById('goal-target').value);
    if (!name || !(target > 0)) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'goal';
    App.goals.push({ id: 'goal-' + (App.goals.length + 1) + '-' + slug, name: name, target: Math.round(target), saved: 0, note: 'Created by the household.' });
    persist();
    render();
  }
});

// Live-filter the transaction table without losing the search focus.
function applyTxFilter() {
  const q = (App.search || '').toLowerCase();
  const rows = document.querySelectorAll('.tx-table tbody tr');
  let shown = 0, spent = 0;
  rows.forEach(function (row) {
    if (row.querySelector('.empty')) return;
    const text = row.textContent.toLowerCase();
    const envCell = row.children[2] ? row.children[2].textContent : '';
    const inEnv = !App.filterEnv || App.filterEnv === 'all' ||
      (App.filterEnv === 'income' ? envCell === 'Income' : envCell === envName(App.filterEnv));
    const ok = (!q || text.indexOf(q) !== -1) && inEnv;
    row.style.display = ok ? '' : 'none';
    if (ok) {
      shown++;
      const amtCell = row.children[3];
      if (amtCell && amtCell.classList.contains('expense')) {
        spent += Number(amtCell.textContent.replace(/[^0-9.]/g, '')) || 0;
      }
    }
  });
  const lede = document.querySelector('.page-head .lede');
  if (lede) lede.textContent = shown + ' entries shown in ' + monthLabel(App.month) + ' — ' + money(spent) + ' spent in the current view.';
}

// Recompute the split result line live, without re-rendering the form.
function updateSplitLive() {
  const total = App.split.shares.reduce(function (a, s) { return a + s; }, 0);
  document.querySelectorAll('[data-share]').forEach(function (input) {
    const i = Number(input.getAttribute('data-share'));
    const owes = (App.split.amount || 0) * (App.split.shares[i] || 0) / 100;
    const row = input.closest('.split-row');
    if (row) row.querySelector('.split-owes').textContent = moneyExact(owes);
  });
  const totalLine = document.querySelector('.split-total');
  if (totalLine) {
    totalLine.innerHTML = 'Bill total: <strong>' + moneyExact(App.split.amount || 0) + '</strong> · Assigned: <strong>' + moneyExact((App.split.amount || 0) * total / 100) + '</strong>';
  }
  const shareNote = document.getElementById('share-note');
  if (shareNote) {
    shareNote.textContent = 'Shares add up to ' + total + '% — ' + (total === 100 ? 'ready to settle.' : total > 100 ? 'over 100%! Trim a share.' : 'under 100% — ' + (100 - total) + '% unassigned.');
  }
}

// ---- Boot ----

render();
