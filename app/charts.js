// Amplop — hand-rolled SVG charts (no library, no network).
// A thin progress bar: value against max, coloured, with a text label.
// Used for envelopes and savings goals.
function progressBar(value, max, color) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const over = value > max;
  const width = Math.round(ratio * 1000) / 10;
  return '<div class="bar" role="img" aria-label="' + esc(Math.round(ratio * 100)) + '% used">' +
    '<div class="bar-fill' + (over ? ' over' : '') + '" style="width:' + width + '%;background:' + esc(color) + '"></div></div>';
}

// Grouped vertical bar chart as inline SVG: one group per label, one bar
// per series. series = [{label, values:[n,n,n], color}].
// Returns an SVG string with value labels on top of each bar.
function barChart(labels, series, height) {
  const h = height || 220;
  const w = 560;
  const padL = 46, padB = 26, padT = 22;
  const plotW = w - padL - 8;
  const plotH = h - padT - padB;
  let maxV = 0;
  series.forEach(function (s) { s.values.forEach(function (v) { if (v > maxV) maxV = v; }); });
  maxV = maxV > 0 ? maxV * 1.08 : 1;
  const groupW = plotW / labels.length;
  const barW = Math.min(34, (groupW - 16) / series.length);
  let out = '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Bar chart">';
  // Gridlines at 0, 1/2 and full scale.
  [0, 0.5, 1].forEach(function (f) {
    const y = padT + plotH * (1 - f);
    out += '<line x1="' + padL + '" y1="' + y + '" x2="' + (w - 8) + '" y2="' + y + '" class="grid"/>';
    out += '<text x="' + (padL - 6) + '" y="' + (y + 4) + '" class="axis" text-anchor="end">' + money(Math.round(maxV * f)) + '</text>';
  });
  labels.forEach(function (label, gi) {
    const gx = padL + gi * groupW + groupW / 2;
    series.forEach(function (s, si) {
      const v = s.values[gi];
      const bh = Math.max(1, (v / maxV) * plotH);
      const x = gx + (si - series.length / 2) * barW + (series.length % 2 === 0 ? barW / 2 : 0);
      const y = padT + plotH - bh;
      out += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (barW - 3) + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + esc(s.color) + '"/>';
      out += '<text x="' + (x + barW / 2 - 1.5).toFixed(1) + '" y="' + (y - 5).toFixed(1) + '" class="bar-label" text-anchor="middle">' + money(v) + '</text>';
    });
    out += '<text x="' + gx.toFixed(1) + '" y="' + (h - 8) + '" class="axis" text-anchor="middle">' + esc(label) + '</text>';
  });
  out += '</svg>';
  return out;
}

// Donut chart as inline SVG: parts = [{label, value, color}].
// The centre shows the total; the legend is rendered by the caller.
function donutChart(parts, size) {
  const s = size || 220;
  const cx = s / 2, cy = s / 2, r = s / 2 - 14, inner = r - 34;
  const total = parts.reduce(function (a, p) { return a + p.value; }, 0) || 1;
  let out = '<svg class="chart donut" viewBox="0 0 ' + s + ' ' + s + '" role="img" aria-label="Spending share donut">';
  let angle = -Math.PI / 2;
  parts.forEach(function (p) {
    if (p.value <= 0) return;
    const frac = p.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const ix1 = cx + inner * Math.cos(a1), iy1 = cy + inner * Math.sin(a1);
    const ix0 = cx + inner * Math.cos(a0), iy0 = cy + inner * Math.sin(a0);
    out += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
      ' L ' + ix1.toFixed(1) + ' ' + iy1.toFixed(1) + ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + ix0.toFixed(1) + ' ' + iy0.toFixed(1) + ' Z" fill="' + esc(p.color) + '"/>';
    angle = a1;
  });
  out += '<text x="' + cx + '" y="' + (cy - 4) + '" class="donut-total" text-anchor="middle">' + money(total) + '</text>';
  out += '<text x="' + cx + '" y="' + (cy + 16) + '" class="donut-sub" text-anchor="middle">spent</text>';
  out += '</svg>';
  return out;
}

// Legend list for a donut: coloured dot, label, amount and share.
function donutLegend(parts) {
  const total = parts.reduce(function (a, p) { return a + p.value; }, 0) || 1;
  const rows = parts.slice().sort(function (a, b) { return b.value - a.value; });
  return '<ul class="legend">' + rows.map(function (p) {
    return '<li><span class="dot" style="background:' + esc(p.color) + '"></span>' +
      '<span class="legend-name">' + esc(p.label) + '</span>' +
      '<span class="legend-num">' + money(p.value) + ' · ' + pct(p.value / total) + '</span></li>';
  }).join('') + '</ul>';
}
