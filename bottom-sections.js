/* ═══════════════════════════════════════════════
   PM2.5 Jakarta — bottom-sections.js
   Logika rendering bagian bawah dashboard
   ═══════════════════════════════════════════════ */

/* ── 1. DATA ──────────────────────────────────── */

const RANKING_DATA = [
  { name: 'Kebon Jeruk',   area: 'Jakarta Barat',   pm25: 82, aqi: 191 },
  { name: 'Ciracas',       area: 'Jakarta Timur',   pm25: 78, aqi: 178 },
  { name: 'Pulo Gadung',   area: 'Jakarta Timur',   pm25: 75, aqi: 172 },
  { name: 'Jagakarsa',     area: 'Jakarta Selatan', pm25: 71, aqi: 163 },
  { name: 'Bundaran HI',   area: 'Jakarta Pusat',   pm25: 62, aqi: 148 },
  { name: 'Tanjung Priok', area: 'Jakarta Utara',   pm25: 54, aqi: 126 },
  { name: 'Penjaringan',   area: 'Jakarta Utara',   pm25: 38, aqi: 89  },
];

const HEALTH_DATA = [
  {
    level: 'Baik',
    range: '0–35 µg/m³',
    bg: '#E8F8EF', levelColor: '#1A6B38', descColor: '#2D5A3D',
    whoBg: '#C6EFCE', whoColor: '#1A6B38',
    desc: 'Kualitas udara memuaskan. Risiko kesehatan sangat kecil bagi semua orang.',
    who: 'Di bawah standar WHO',
    icon: '😊'
  },
  {
    level: 'Sedang',
    range: '36–75 µg/m³',
    bg: '#FEF5E4', levelColor: '#7D5A0A', descColor: '#6B4C0A',
    whoBg: '#FCE8C0', whoColor: '#7D5A0A',
    desc: 'Dapat diterima, namun beberapa polutan menimbulkan risiko bagi kelompok sensitif.',
    who: 'Melampaui standar WHO',
    icon: '😐'
  },
  {
    level: 'Tidak Sehat',
    range: '76–150 µg/m³',
    bg: '#FDEDEC', levelColor: '#8B2218', descColor: '#7A2118',
    whoBg: '#FBBCB8', whoColor: '#8B2218',
    desc: 'Semua orang mulai merasakan efek kesehatan. Kelompok sensitif lebih parah.',
    who: '5× standar WHO',
    icon: '😷'
  },
  {
    level: 'Berbahaya',
    range: '150+ µg/m³',
    bg: '#F5EEF8', levelColor: '#5B2C82', descColor: '#4A2469',
    whoBg: '#DCC6F0', whoColor: '#5B2C82',
    desc: 'Peringatan darurat kesehatan. Seluruh populasi berisiko terkena dampak serius.',
    who: '10× standar WHO',
    icon: '☠️'
  },
];

const CITY_COMPARE_DATA = [
  { city: 'Jakarta',   country: 'Indonesia',  pm25: 75,  max: 150 },
  { city: 'Hanoi',     country: 'Vietnam',    pm25: 68,  max: 150 },
  { city: 'Manila',    country: 'Filipina',   pm25: 52,  max: 150 },
  { city: 'Bangkok',   country: 'Thailand',   pm25: 48,  max: 150 },
  { city: 'Kuala Lumpur', country: 'Malaysia', pm25: 32, max: 150 },
  { city: 'Singapura', country: 'Singapura',  pm25: 18,  max: 150 },
];

/* ── 2. HELPERS (shared dengan app.js) ───────── */
// getColor() dan getStatus() sudah ada di app.js
// Pastikan bottom-sections.js dimuat SETELAH app.js

/* ── 3. RENDER RANKING ────────────────────────── */

function medalClass(i) {
  if (i === 0) return 'gold';
  if (i === 1) return 'silver';
  if (i === 2) return 'bronze';
  return 'plain';
}

function renderRanking() {
  const polluted = [...RANKING_DATA].sort((a, b) => b.pm25 - a.pm25);
  const clean    = [...RANKING_DATA].sort((a, b) => a.pm25 - b.pm25);

  function buildItems(list) {
    return list.map((s, i) => {
      const col    = getColor(s.pm25);
      const status = getStatus(s.pm25);
      return `
        <div class="rank-item">
          <div class="rank-num ${medalClass(i)}">${i + 1}</div>
          <div class="rank-info">
            <div class="rank-name">${s.name}</div>
            <div class="rank-area">${s.area}</div>
          </div>
          <div class="rank-right">
            <div class="rank-val" style="color:${col}">${s.pm25} <span style="font-size:10px;font-weight:400;color:var(--muted)">µg/m³</span></div>
            <span class="rank-badge" style="background:${status.bg};color:${status.color}">${status.label}</span>
          </div>
        </div>`;
    }).join('');
  }

  document.getElementById('rankPolluted').innerHTML = buildItems(polluted);
  document.getElementById('rankClean').innerHTML    = buildItems(clean);
}

/* ── 4. RENDER HEALTH GRID ────────────────────── */

function renderHealthGrid() {
  const html = HEALTH_DATA.map(h => `
    <div class="health-item" style="background:${h.bg}">
      <div style="font-size:20px;margin-bottom:6px">${h.icon}</div>
      <div class="health-level" style="color:${h.levelColor}">${h.level}</div>
      <div class="health-val" style="color:${h.levelColor}">${h.range}</div>
      <div class="health-desc" style="color:${h.descColor}">${h.desc}</div>
      <span class="health-who" style="background:${h.whoBg};color:${h.whoColor}">${h.who}</span>
    </div>`).join('');

  document.getElementById('healthGrid').innerHTML = html;
}

/* ── 5. RENDER CITY COMPARE ───────────────────── */

function renderCityCompare() {
  const maxVal = Math.max(...CITY_COMPARE_DATA.map(c => c.pm25));

  const html = CITY_COMPARE_DATA.map(c => {
    const col    = getColor(c.pm25);
    const status = getStatus(c.pm25);
    const pct    = Math.round((c.pm25 / (maxVal * 1.1)) * 100);

    return `
      <div class="city-row">
        <div class="city-row-name">
          <div style="font-size:13px;font-weight:600;color:var(--text)">${c.city}</div>
          <div style="font-size:10px;color:var(--muted)">${c.country}</div>
        </div>
        <div class="city-row-bar-wrap">
          <div class="city-row-bar" style="width:${pct}%;background:${col}">
            ${pct > 15 ? c.pm25 : ''}
          </div>
        </div>
        <div class="city-row-val" style="color:${col}">${c.pm25} µg/m³</div>
        <div class="city-row-badge">
          <span class="city-row-pill" style="background:${status.bg};color:${status.color}">${status.label}</span>
        </div>
      </div>`;
  }).join('');

  document.getElementById('cityCompare').innerHTML = html;
}

/* ── 6. INIT ──────────────────────────────────── */

window.addEventListener('load', () => {
  renderRanking();
  renderHealthGrid();
  renderCityCompare();
});
