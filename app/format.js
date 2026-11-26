// Amplop — money, percent and date formatting helpers.
// Format a number as US dollars, no cents for whole amounts.
// money(5850) -> "$5,850"; money(283.5) -> "$283.50"
function money(n) {
  const v = Number(n) || 0;
  const cents = Math.round(v * 100) / 100;
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const whole = Math.floor(abs);
  const frac = Math.round((abs - whole) * 100);
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + '$' + grouped + (frac ? '.' + String(frac).padStart(2, '0') : '');
}

// Format a number as US dollars with cents always shown (tables, forms).
function moneyExact(n) {
  const v = Number(n) || 0;
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(Math.round(v * 100) / 100);
  const whole = Math.floor(abs);
  const frac = Math.round((abs - whole) * 100);
  return sign + '$' + String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + String(frac).padStart(2, '0');
}

// Format a ratio (0.316) as a percent with one decimal: "31.6%".
function pct(ratio) {
  return (Math.round((Number(ratio) || 0) * 1000) / 10).toFixed(1) + '%';
}

// "2026-11-03" -> "Nov 3, 2026". No Date object: plain table lookup.
function fmtDate(iso) {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parts = String(iso).split('-');
  const m = names[Number(parts[1]) - 1] || '';
  const d = Number(parts[2]);
  return m + ' ' + d + ', ' + parts[0];
}

// "2026-11" -> "November 2026".
function monthLabel(key) {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const parts = String(key).split('-');
  return (names[Number(parts[1]) - 1] || '') + ' ' + parts[0];
}

// Short month label for chart axes: "2026-11" -> "Nov".
function monthShort(key) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(String(key).split('-')[1]) - 1] || '';
}

// Escape text for safe insertion into HTML strings.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
