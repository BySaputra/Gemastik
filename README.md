# PM2.5 Jakarta Dashboard

Dashboard monitoring kualitas udara PM2.5 untuk kota Jakarta.

---

## Struktur File

```
pm25-jakarta/
└── vanilla/              ← Tech stack: HTML + CSS + JavaScript murni
    ├── index.html        ← Struktur & layout (markup only)
    ├── style.css         ← Semua styling & design tokens
    └── app.js            ← Semua logika interaktif
```

---

## Penjelasan Setiap File

### `index.html` — Struktur (HTML)
Berisi kerangka halaman saja — tidak ada style inline, tidak ada script inline.
Setiap section diberi komentar blok yang jelas:
- Navbar
- Alert Banner
- Hero Card
- Quick Stats
- Action Cards
- Map + Chart Grid
- Education Section

### `style.css` — Tampilan (CSS)
Dibagi menjadi 16 bagian bernomor:
1. Design Tokens (variabel warna, ukuran, font)
2. Dark Mode Tokens
3. Reset & Base
4. Navbar
5. Alert Banner
6. Main Layout & Grid
7. Hero Card
8. Quick Stats
9. Section Label
10. Action Cards
11. Map Card
12. Chart Card
13. Tabs
14. Education
15. Responsive (mobile breakpoints)
16. Leaflet Popup Overrides

### `app.js` — Interaksi (JavaScript)
Dibagi menjadi 8 bagian bernomor:
1. Data (konstanta level AQ, data chart, data stasiun)
2. Helpers (getColor, getStatus)
3. Hero Level Switcher
4. Dark Mode Toggle
5. Map — Leaflet.js
6. Chart — Chart.js
7. Education Toggle
8. Init (window.onload)

---

## Cara Menjalankan

Karena menggunakan CDN untuk Leaflet dan Chart.js,
buka langsung di browser dengan koneksi internet:

```bash
# Cara 1: buka langsung
open vanilla/index.html

# Cara 2: pakai live server (VS Code extension)
# klik kanan index.html → Open with Live Server

# Cara 3: pakai Python
cd vanilla
python3 -m http.server 3000
# buka http://localhost:3000
```

---

## CDN Dependencies

| Library    | Versi  | Kegunaan              |
|------------|--------|-----------------------|
| Chart.js   | 4.4.0  | Line chart tren PM2.5 |
| Leaflet    | 1.9.4  | Peta interaktif Jakarta|
| DM Sans    | —      | Font (Google Fonts)   |
| CartoDB    | —      | Map tile layer        |

---

## Fitur Dashboard

- Hero card dengan nilai PM2.5 real-time + AQI bar spectrum
- Klik hero untuk cycle antar 4 level kualitas udara
- Alert banner kondisional (muncul saat Tidak Sehat / Berbahaya)
- 4 quick stats (min, maks, rata-rata, vs kemarin)
- 3 action recommendation cards
- Peta Leaflet dengan 7 stasiun pemantauan Jakarta (koordinat nyata)
- Line chart 24 jam / 7 hari dengan batas WHO
- Panel edukasi PM2.5 collapsible
- Dark mode toggle
- Fully responsive (mobile + desktop)

