// ============ data titik ============
// Kategori: "taman" | "baca" | "gedung" | "kantin"
// Untuk foto: bisa pakai URL internet atau nama file lokal (misal: "images/taman-bareti.jpg")
const SPOTS = [
  {
    id: "taman-bareti",
    name: "Taman Bareti UPI",
    kategori: "taman",
    desc: "Taman ikonik yang jadi titik kumpul paling ramai di UPI, banyak pohon rindang dan bangku panjang — cocok lesehan sambil diskusi kelompok.",
    fasilitas: ["Teduh ", "Bangku taman ", "Deket gerbang utama"],
    gmaps: "https://maps.google.com/?q=Taman+Bareti+UPI+Bandung",
    foto: "https://i.ibb.co.com/chyYkZ7x/tamanbaret.jpg"
  },
  {
    id: "perpus-pusat",
    name: "Perpustakaan Pusat UPI",
    kategori: "baca",
    desc: "Ruang baca ber-AC dengan koleksi puluhan ribu buku, paling pas buat yang butuh suasana tenang dan fokus penuh.",
    fasilitas: ["AC, ", "Wifi, ", "Buka Sen–Jum 08.00–17.00, Sab 08.00–12.30"],
    gmaps: "https://maps.google.com/?q=Perpustakaan+Pusat+UPI+Bandung",
    foto: "https://i.ibb.co.com/CdXwzf7/perpusupi.jpg"
  },
  {
    id: "Lobby FPSD",
    name: "Lobby FPSD",
    kategori: "gedung",
    desc: "Koridor terbuka di dekat gedung studio, langganan anak DKV buat nugas bareng lintas angkatan sambil ngobrol santai.",
    fasilitas: ["Colokan di beberapa titik, ", "Dekat studio, ", "Rame anak DKV "],
    gmaps: "https://maps.google.com/?q=FPSD+UPI+Bandung",
    foto: "https://i.ibb.co.com/7dZf5zmX/lobbyfpsd.jpg"
  },
  {
    id: "Plaza FPSD",
    name: "Plaza depan Gedung FPSD Baru",
    kategori: "gedung",
    desc: "Sering digunakan oleh mahasiswa-mahasiswi FPSD UPI untuk healing ataupun mengerjakan tugas-tugas.",
    fasilitas: ["Luas, ", "Sering ada acara organisasi"],
    gmaps: "https://maps.google.com/?q=FPSD+UPI+Bandung",
    foto: "https://i.ibb.co.com/QB8RCTr/plazafpsd.jpg"
  },
  {
    id: "halaman-al-furqon",
    name: "Halaman Masjid Al-Furqon",
    kategori: "taman",
    desc: "Teras dan halaman masjid kampus yang teduh, enak buat healing sebentar atau diskusi santai di sela waktu salat.",
    fasilitas: ["Teduh, ", "Tenang, ", "Dekat tempat wudu "],
    gmaps: "https://maps.google.com/?q=Masjid+Al+Furqon+UPI+Bandung",
    foto: "https://i.ibb.co.com/hNp4w4c/alfurqonupi.jpg"
  },
  {
    id: "Kantin PKM",
    name: "Kantin PKM",
    kategori: "kantin",
    desc: "Tempat makan sekaligus nugas sambil ngobrol, harga bersahabat buat kantong mahasiswa — paling ramai pas jam istirahat.",
    fasilitas: ["Harga mahasiswa, ", "Rame jam istirahat"],
    gmaps: "https://share.google/zFnwikOI3G5fZJ38g",
    foto: "https://i.ibb.co.com/s91hC2SX/kantin-pkm.jpg"
  },
  {
    id: "Center of Excellence",
    name: "Center of Excellence",
    kategori: "gedung",
    desc: "Gedung dekat gerlong yang penuh junkfood tapi juga punya tempat yang nyaman untuk nugas.",
    fasilitas: ["Indoor, ", "Colokan, ", "Enak sore hari"],
    gmaps: "https://maps.app.goo.gl/Cpigec1hakD4Jc5Q8",
    foto: "https://i.ibb.co.com/NdRRdQwn/coeupi.jpg"
  }
];

const CATEGORY_LABEL = {
  taman: "Taman & Outdoor",
  baca: "Perpustakaan & Ruang Baca",
  gedung: "Selasar & Gedung",
  kantin: "Kantin & Kafe"
};

const FILTERS = [{ key: "semua", label: "Semua" }, ...Object.entries(CATEGORY_LABEL).map(([key, label]) => ({ key, label }))];

// ============ state ============
let activeFilter = "semua";
let searchTerm = "";

const PIN_KEY = "titikaman_pins";
const USER_SPOT_KEY = "titikaman_usulan";

function getPins() {
  return JSON.parse(localStorage.getItem(PIN_KEY) || "[]");
}
function setPins(pins) {
  localStorage.setItem(PIN_KEY, JSON.stringify(pins));
}
function getUserSpots() {
  return JSON.parse(localStorage.getItem(USER_SPOT_KEY) || "[]");
}
function setUserSpots(spots) {
  localStorage.setItem(USER_SPOT_KEY, JSON.stringify(spots));
}

// ============ render helpers ============
function cardHTML(spot, { removable = false } = {}) {
  const pinned = getPins().includes(spot.id);
  const facHTML = (spot.fasilitas || []).map(f => `<span class="fac">${f}</span>`).join("");
  
  // Tampilkan gambar jika ada
  const imageHTML = spot.foto 
    ? `<div class="card-media"><img src="${spot.foto}" alt="${spot.name}" loading="lazy"></div>` 
    : '';

  // Link Rute Google Maps
  const mapsQuery = encodeURIComponent(spot.gmaps || `${spot.name} UPI Bandung`);
  const mapsUrl = spot.gmaps && spot.gmaps.startsWith("http") 
    ? spot.gmaps 
    : `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return `
    <article class="spot-card" data-id="${spot.id}">
      ${imageHTML}
      <div class="card-body">
        <div class="card-top">
          <span class="card-tag tag-${spot.kategori}">${CATEGORY_LABEL[spot.kategori]}</span>
          <button class="pin-btn ${pinned ? "pinned" : ""}" data-pin="${spot.id}" aria-label="Pin tempat ini" title="Pin tempat ini">${pinned ? "✓" : "📍"}</button>
        </div>
        <h3 class="card-name">${spot.name}</h3>
        <p class="card-desc">${spot.desc}</p>
        <div class="card-facilities">${facHTML}</div>
        
        <div class="card-actions">
          <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-maps">
            <span class="icon">🧭</span> Buka Rute Google Maps
          </a>
        </div>

        ${removable ? `<div class="card-foot"><span>Usulan kamu</span><button data-remove="${spot.id}" class="fac" style="cursor:pointer;background:none;color:var(--terracotta);">Hapus</button></div>` : ""}
      </div>
    </article>
  `;
}

function renderFilters() {
  const row = document.getElementById("filterRow");
  row.innerHTML = FILTERS.map(f =>
    `<button class="chip ${f.key === activeFilter ? "active" : ""}" data-filter="${f.key}">${f.label}</button>`
  ).join("");
  row.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      renderFilters();
      renderSpots();
    });
  });
}

function allSpots() {
  return [...SPOTS, ...getUserSpots()];
}

function renderSpots() {
  const grid = document.getElementById("spotGrid");
  const empty = document.getElementById("emptyState");
  const title = document.getElementById("resultTitle");
  const count = document.getElementById("resultCount");

  const term = searchTerm.trim().toLowerCase();
  const filtered = allSpots().filter(s => {
    const matchCat = activeFilter === "semua" || s.kategori === activeFilter;
    const haystack = (s.name + " " + s.desc + " " + (s.fasilitas || []).join(" ")).toLowerCase();
    const matchTerm = !term || haystack.includes(term);
    return matchCat && matchTerm;
  });

  title.textContent = activeFilter === "semua" ? "Semua titik" : CATEGORY_LABEL[activeFilter];
  count.textContent = `${filtered.length} tempat`;

  grid.innerHTML = filtered.map(s => cardHTML(s)).join("");
  empty.hidden = filtered.length !== 0;

  attachPinHandlers(grid);
}

function renderFavorites() {
  const grid = document.getElementById("favGrid");
  const empty = document.getElementById("favEmpty");
  const pins = getPins();
  const favSpots = allSpots().filter(s => pins.includes(s.id));

  grid.innerHTML = favSpots.map(s => cardHTML(s)).join("");
  empty.hidden = favSpots.length !== 0;
  attachPinHandlers(grid);
}

function renderUserSpots() {
  const grid = document.getElementById("userGrid");
  const userSpots = getUserSpots();
  grid.innerHTML = userSpots.map(s => cardHTML(s, { removable: true })).join("");

  grid.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.remove;
      setUserSpots(getUserSpots().filter(s => s.id !== id));
      renderAll();
      showToast("Usulan dihapus");
    });
  });
  attachPinHandlers(grid);
}

function attachPinHandlers(scope) {
  scope.querySelectorAll("[data-pin]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.pin;
      let pins = getPins();
      if (pins.includes(id)) {
        pins = pins.filter(p => p !== id);
        showToast("Pin dilepas");
      } else {
        pins.push(id);
        showToast("Ditambahkan ke favorit");
      }
      setPins(pins);
      renderAll();
    });
  });
}

function renderAll() {
  renderSpots();
  renderFavorites();
  renderUserSpots();
}

// ============ toast ============
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

// ============ events ============
document.getElementById("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderSpots();
});

document.getElementById("suggestForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("fName").value.trim();
  const kategori = document.getElementById("fCategory").value;
  const desc = document.getElementById("fDesc").value.trim();
  const foto = document.getElementById("fFoto") ? document.getElementById("fFoto").value.trim() : "";
  const gmaps = document.getElementById("fGmaps") ? document.getElementById("fGmaps").value.trim() : "";

  if (!name || !kategori || !desc) return;

  const newSpot = {
    id: "usulan-" + Date.now(),
    name,
    kategori,
    desc,
    fasilitas: ["Usulan Angkatan"],
    foto,
    gmaps
  };
  const spots = getUserSpots();
  spots.push(newSpot);
  setUserSpots(spots);

  e.target.reset();
  renderAll();
  showToast("Tempat baru ditambahkan!");
});

// ============ init ============
renderFilters();
renderAll();
