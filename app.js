/* ═══════════════════════════════════════════════
   PM2.5 Jakarta Dashboard — app.js
   Tech Stack : Vanilla JavaScript (ES6+)
   ═══════════════════════════════════════════════ */

/* ── 1. DATA ──────────────────────────────────── */

const AQ_LEVELS = [
  {
    val: 75, status: 'Tidak Sehat',
    color: '#E74C3C', mid: '#F1948A',
    thumbPct: '62%', showAlert: true
  },
  {
    val: 38, status: 'Baik',
    color: '#27AE60', mid: '#82E0AA',
    thumbPct: '28%', showAlert: false
  },
  {
    val: 58, status: 'Sedang',
    color: '#F39C12', mid: '#FAD7A0',
    thumbPct: '46%', showAlert: false
  },
  {
    val: 162, status: 'Berbahaya',
    color: '#8E44AD', mid: '#C39BD3',
    thumbPct: '88%', showAlert: true
  },
];

const CHART_DATA = {
  '24h': {
    labels: ['00','01','02','03','04','05','06','07','08','09','10','11',
             '12','13','14','15','16','17','18','19','20','21','22','23'],
    values: [72,68,65,63,61,64,78,89,85,82,79,74,70,66,58,60,65,70,75,78,76,74,73,75]
  },
  '7d': {
    labels: ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'],
    values: [65, 71, 80, 75, 68, 82, 71]
  }
};

const STATIONS = [
  {
    name: 'Stasiun Bundaran HI', area: 'Jakarta Pusat',
    address: 'Jl. MH Thamrin, Menteng, Jakarta Pusat',
    lat: -6.1950, lng: 106.8229,
    pm25: 62, aqi: 148, trend: '▲ +4%', updated: 'Diperbarui 2 mnt lalu'
  },
  {
    name: 'Stasiun Pulo Gadung', area: 'Jakarta Timur',
    address: 'Jl. Bekasi Raya, Pulo Gadung, Jakarta Timur',
    lat: -6.1881, lng: 106.9067,
    pm25: 75, aqi: 172, trend: '▼ -2%', updated: 'Diperbarui 3 mnt lalu'
  },
  {
    name: 'Stasiun Penjaringan', area: 'Jakarta Utara',
    address: 'Jl. Pluit Raya, Penjaringan, Jakarta Utara',
    lat: -6.1248, lng: 106.7923,
    pm25: 38, aqi: 89, trend: '▼ -8%', updated: 'Diperbarui 1 mnt lalu'
  },
  {
    name: 'Stasiun Kebon Jeruk', area: 'Jakarta Barat',
    address: 'Jl. Panjang, Kebon Jeruk, Jakarta Barat',
    lat: -6.1944, lng: 106.7680,
    pm25: 82, aqi: 191, trend: '▲ +11%', updated: 'Diperbarui 4 mnt lalu'
  },
  {
    name: 'Stasiun Jagakarsa', area: 'Jakarta Selatan',
    address: 'Jl. Raya Jagakarsa, Jakarta Selatan',
    lat: -6.3349, lng: 106.8227,
    pm25: 71, aqi: 163, trend: '▲ +3%', updated: 'Diperbarui 5 mnt lalu'
  },
  {
    name: 'Stasiun Ciracas', area: 'Jakarta Timur',
    address: 'Jl. Raya Bogor, Ciracas, Jakarta Timur',
    lat: -6.3098, lng: 106.8876,
    pm25: 78, aqi: 178, trend: '▲ +6%', updated: 'Diperbarui 2 mnt lalu'
  },
  {
    name: 'Stasiun Tanjung Priok', area: 'Jakarta Utara',
    address: 'Jl. Enggano, Tanjung Priok, Jakarta Utara',
    lat: -6.1094, lng: 106.8722,
    pm25: 54, aqi: 126, trend: '▼ -1%', updated: 'Diperbarui 6 mnt lalu'
  }
];

/* ── 2. HELPERS ───────────────────────────────── */

function getColor(pm25) {
  if (pm25 <= 35)  return '#27AE60';
  if (pm25 <= 75)  return '#F39C12';
  if (pm25 <= 150) return '#E74C3C';
  return '#8E44AD';
}

function getStatus(pm25) {
  if (pm25 <= 35)  return { label: 'Baik',        bg: '#E8F8EF', color: '#1A6B38' };
  if (pm25 <= 75)  return { label: 'Sedang',       bg: '#FEF5E4', color: '#7D5A0A' };
  if (pm25 <= 150) return { label: 'Tidak Sehat',  bg: '#FDEDEC', color: '#8B2218' };
  return               { label: 'Berbahaya',   bg: '#F5EEF8', color: '#5B2C82' };
}

/* ── 3. HERO — LEVEL SWITCHER ─────────────────── */

let currentLevel = 0;

function applyLevel(lvl) {
  const root = document.documentElement;
  root.style.setProperty('--current',     lvl.color);
  root.style.setProperty('--current-mid', lvl.mid);

  document.getElementById('heroValue').textContent      = lvl.val;
  document.getElementById('heroStatusText').textContent = lvl.status;
  document.getElementById('aqiThumb').style.left        = lvl.thumbPct;
  document.getElementById('aqiThumb').style.borderColor = lvl.color;
  document.getElementById('logoDot').style.background   = lvl.color;
  document.getElementById('alertBanner').style.display  = lvl.showAlert ? 'flex' : 'none';
}

document.getElementById('heroCard').addEventListener('click', () => {
  currentLevel = (currentLevel + 1) % AQ_LEVELS.length;
  applyLevel(AQ_LEVELS[currentLevel]);
});

/* ── 4. DARK MODE ─────────────────────────────── */

let isDark = false;

function toggleDark() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  // Rebuild chart so Chart.js picks up new background color
  if (window._chartInstance) {
    window._chartInstance.destroy();
    buildChart(CHART_DATA['24h']);
  }
}

/* ── 5. MAP (Leaflet) ─────────────────────────── */

function buildMap() {
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const map = L.map('map', {
    center: [-6.2088, 106.8456],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: false
  });

  L.tileLayer(tileUrl, { subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  L.control.attribution({ prefix: false })
    .addAttribution('© <a href="https://carto.com">CARTO</a> © <a href="https://openstreetmap.org">OSM</a>')
    .addTo(map);

  STATIONS.forEach(s => {
    const col    = getColor(s.pm25);
    const status = getStatus(s.pm25);
    const trendUp = s.trend.startsWith('▲');

    // Custom SVG pin icon
    const svgIcon = `
      <svg width="56" height="62" viewBox="0 0 56 62" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="28" cy="58" rx="9" ry="3.5" fill="${col}" opacity="0.25"/>
        <path d="M28 4C15 4 6 13 6 24C6 38 28 54 28 54C28 54 50 38 50 24C50 13 41 4 28 4Z"
              fill="${col}" stroke="white" stroke-width="2"/>
        <circle cx="28" cy="24" r="10" fill="white" opacity="0.92"/>
        <text x="28" y="29" text-anchor="middle"
              style="font-size:11px;font-weight:700;fill:${col};font-family:system-ui,sans-serif;">
          ${s.pm25}
        </text>
      </svg>`;

    const icon = L.divIcon({
      html: svgIcon,
      className: '',
      iconSize: [56, 62],
      iconAnchor: [28, 54],
      popupAnchor: [0, -56]
    });

    const marker = L.marker([s.lat, s.lng], { icon }).addTo(map);

    // Popup HTML
    const popupHtml = `
      <div style="font-family:system-ui,sans-serif;min-width:180px;padding:4px 2px;">
        <div style="font-weight:700;font-size:14px;color:#1A1D23;margin-bottom:4px;">${s.name}</div>
        <div style="font-size:11px;color:#6B7280;margin-bottom:8px;">${s.address}</div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="font-size:26px;font-weight:800;color:${col};">${s.pm25}</div>
          <div>
            <div style="font-size:10px;color:#6B7280;font-weight:600;letter-spacing:0.5px;">µg/m³ PM2.5</div>
            <span style="display:inline-block;margin-top:3px;padding:2px 8px;border-radius:10px;
                         font-size:11px;font-weight:600;background:${status.bg};color:${status.color};">
              ${status.label}
            </span>
          </div>
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid #E5E7EB;
                    display:flex;justify-content:space-between;font-size:11px;color:#6B7280;">
          <span>AQI: <strong style="color:#1A1D23;">${s.aqi}</strong></span>
          <span>Tren: <strong style="color:${trendUp ? '#E74C3C' : '#27AE60'}">${s.trend}</strong></span>
        </div>
        <div style="font-size:10px;color:#9CA3AF;margin-top:6px;">${s.updated}</div>
      </div>`;

    marker.bindPopup(popupHtml, { maxWidth: 240, className: 'pm-popup' });
  });
}

/* ── 6. CHART (Chart.js) ──────────────────────── */

function buildChart(data) {
  const ctx  = document.getElementById('myChart').getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 160);
  grad.addColorStop(0, 'rgba(231,76,60,0.18)');
  grad.addColorStop(1, 'rgba(231,76,60,0.01)');

  const whoLine = {
    type: 'line',
    label: 'Batas WHO',
    data: Array(data.labels.length).fill(15),
    borderColor: 'rgba(39,174,96,0.5)',
    borderDash: [4, 4],
    borderWidth: 1,
    pointRadius: 0,
    fill: false,
    tension: 0
  };

  window._chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'PM2.5 (µg/m³)',
          data: data.values,
          borderColor: '#E74C3C',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#E74C3C',
          fill: true,
          backgroundColor: grad,
          tension: 0.4
        },
        whoLine
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(26,29,35,0.92)',
          titleFont: { size: 11 },
          bodyFont:  { size: 12 },
          padding: 10,
          filter: item => item.datasetIndex === 0,
          callbacks: {
            label: c => `PM2.5: ${c.raw} µg/m³`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 }, color: '#9CA3AF', maxRotation: 0 }
        },
        y: {
          grid: { color: 'rgba(156,163,175,0.15)' },
          ticks: { font: { size: 10 }, color: '#9CA3AF' },
          border: { display: false },
          min: 0,
          max: 100
        }
      }
    }
  });
}

function setRange(range, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  if (window._chartInstance) window._chartInstance.destroy();
  buildChart(CHART_DATA[range]);
}

/* ── 7. EDUCATION TOGGLE ──────────────────────── */

function toggleEdu() {
  const body    = document.getElementById('eduBody');
  const chevron = document.getElementById('eduChevron');
  body.classList.toggle('open');
  chevron.classList.toggle('open');
}

/* ── 8. INIT ──────────────────────────────────── */

window.addEventListener('load', () => {
  applyLevel(AQ_LEVELS[0]);   // Set initial hero state
  buildMap();                  // Render Leaflet map
  buildChart(CHART_DATA['24h']); // Render Chart.js
  document.getElementById('eduBody').classList.add('open');
  document.getElementById('eduChevron').classList.add('open');
});
