// ============ Buscar establecimientos — catálogo administrable ============
// Lee assets/data/establecimientos.json (fuente única, fácil de actualizar
// sin tocar el HTML) y renderiza lista + mapa con búsqueda y filtros.

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('establecimientosGrid');
  if (!grid) return; // esta página no está activa

  const searchInput = document.getElementById('searchInput');
  const categoriaSelect = document.getElementById('categoriaFilter');
  const zonaSelect = document.getElementById('zonaFilter');
  const resultsCount = document.getElementById('resultsCount');
  const noResults = document.getElementById('noResults');
  const viewButtons = document.querySelectorAll('.view-toggle button');
  const mapViewEl = document.getElementById('mapView');
  const mapEl = document.getElementById('establecimientos-map');

  let data = [];
  let map = null;
  let markers = [];
  let clusterGroup = null;

  const svgPin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.2 7-12a7 7 0 0 0-14 0c0 4.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></svg>';

  function uniqueSorted(values) {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'es'));
  }

  function populateFilters(items) {
    const categorias = uniqueSorted(items.map(i => i.categoria));
    const zonas = uniqueSorted(items.flatMap(i => i.sucursales.map(s => s.zona)));
    categorias.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      categoriaSelect.appendChild(opt);
    });
    zonas.forEach(z => {
      const opt = document.createElement('option');
      opt.value = z; opt.textContent = z;
      zonaSelect.appendChild(opt);
    });
  }

  function matchesFilters(item) {
    const q = searchInput.value.trim().toLowerCase();
    const categoria = categoriaSelect.value;
    const zona = zonaSelect.value;

    if (categoria && item.categoria !== categoria) return false;
    if (zona && !item.sucursales.some(s => s.zona === zona)) return false;
    if (q) {
      const haystack = [
        item.nombre, item.categoria, item.descripcion,
        ...item.sucursales.map(s => `${s.nombre} ${s.ciudad} ${s.zona} ${s.direccion}`)
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }

  function cardHtml(item) {
    const sucursalesHtml = item.sucursales.map(s => `
      <div class="establecimiento-sucursal">
        ${svgPin}
        <span>${s.nombre} · ${s.zona}, ${s.ciudad}</span>
      </div>
    `).join('');
    const tokensHtml = typeof item.tokens === 'number'
      ? `<span class="establecimiento-tokens">Valor: ${item.tokens} tokens</span>`
      : '';
    const sucursalesCountHtml = item.sucursales.length > 1
      ? `<span class="establecimiento-sucursales-count">${item.sucursales.length} ubicaciones</span>`
      : '';
    return `
      <article class="establecimiento-card">
        ${tokensHtml}
        <div class="establecimiento-head">
          <div class="establecimiento-logo"><img src="${item.logo}" alt="${item.nombre}" loading="lazy" /></div>
          <div>
            <span class="venue-tag">${item.categoria}</span>
            <h3>${item.nombre}</h3>
          </div>
        </div>
        <p class="desc">${item.descripcion}</p>
        ${sucursalesCountHtml}
        <div class="establecimiento-sucursales">${sucursalesHtml}</div>
      </article>
    `;
  }

  function render() {
    const filtered = data.filter(matchesFilters);
    grid.innerHTML = filtered.map(cardHtml).join('');
    resultsCount.textContent = filtered.length === 1
      ? '1 establecimiento encontrado'
      : `${filtered.length} establecimientos encontrados`;
    noResults.style.display = filtered.length ? 'none' : 'block';
    renderMapMarkers(filtered);
  }

  function initMap() {
    if (!mapEl || typeof L === 'undefined') return;
    map = L.map(mapEl, { scrollWheelZoom: false }).setView([19.39, -99.18], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);
    // Con categorías como Cinemex (78 sucursales) muchos pines quedan encimados
    // a nivel de ciudad y era casi imposible darle clic al correcto (parecía
    // que "no aparecían bien" o que no mostraban su información). Agrupar en
    // clusters resuelve esto: junta los pines cercanos en una burbuja con
    // número, que se separa/expande al acercar el zoom o darle clic.
    if (typeof L.markerClusterGroup === 'function') {
      clusterGroup = L.markerClusterGroup({ maxClusterRadius: 45 });
      map.addLayer(clusterGroup);
    }
  }

  function renderMapMarkers(items) {
    if (!map) return;
    if (clusterGroup) clusterGroup.clearLayers();
    else markers.forEach(m => map.removeLayer(m));
    markers = [];
    items.forEach(item => {
      item.sucursales.forEach(s => {
        if (typeof s.lat !== 'number' || typeof s.lng !== 'number') return;
        const marker = L.marker([s.lat, s.lng]);
        const direccionHtml = s.direccion ? `<span class="popup-address">${s.direccion}</span>` : '';
        marker.bindPopup(`<b>${s.nombre}</b><span>${item.categoria} · ${s.zona}, ${s.ciudad}</span>${direccionHtml}`);
        markers.push(marker);
        if (clusterGroup) clusterGroup.addLayer(marker);
        else marker.addTo(map);
      });
    });
  }

  function switchView(view) {
    viewButtons.forEach(b => b.classList.toggle('active', b.dataset.view === view));
    if (view === 'map') {
      grid.classList.add('hidden-view');
      mapViewEl.classList.add('active');
      if (!map) initMap();
      setTimeout(() => map && map.invalidateSize(), 50);
      renderMapMarkers(data.filter(matchesFilters));
    } else {
      grid.classList.remove('hidden-view');
      mapViewEl.classList.remove('active');
    }
  }

  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  [searchInput, categoriaSelect, zonaSelect].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  fetch('assets/data/establecimientos.json')
    .then(res => res.json())
    .then(items => {
      data = items;
      populateFilters(items);
      render();
      const heroCount = document.getElementById('heroEstablecimientosCount');
      if (heroCount) heroCount.textContent = `+${items.length}`;
      const statsCount = document.getElementById('statsEstablecimientosCount');
      if (statsCount) statsCount.textContent = items.length;
    })
    .catch(() => {
      grid.innerHTML = '<p class="no-results">No se pudo cargar el catálogo. Intenta de nuevo más tarde.</p>';
    });
});
