/**
 * Contacto: mapa dinámico con OpenStreetMap (Leaflet) y ruta desde el cliente.
 * - Requiere conexión a Internet para tiles y OSRM.
 */

const BUSINESS = {
  name: 'ProgramStile Studio',
  lat: 40.4168,
  lng: -3.7038,
  address: 'Madrid, España'
};

function setStatus(message) {
  const el = document.querySelector('[data-map-status]');
  if (el) el.textContent = message;
}

function assertLeafletAvailable() {
  if (!window.L) throw new Error('Leaflet no está disponible.');
}

function createMap() {
  assertLeafletAvailable();

  const mapEl = document.getElementById('map');
  if (!mapEl) throw new Error('No existe el contenedor del mapa.');

  const map = window.L.map(mapEl, { scrollWheelZoom: false }).setView([BUSINESS.lat, BUSINESS.lng], 13);

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  window.L.marker([BUSINESS.lat, BUSINESS.lng])
    .addTo(map)
    .bindPopup(`<strong>${BUSINESS.name}</strong><br>${BUSINESS.address}`)
    .openPopup();

  return map;
}

function createRouter(map) {
  // Leaflet Routing Machine expone L.Routing
  if (!window.L?.Routing?.control) throw new Error('Leaflet Routing Machine no está disponible.');

  return window.L.Routing.control({
    waypoints: [],
    routeWhileDragging: false,
    addWaypoints: false,
    show: false,
    fitSelectedRoutes: true,
    lineOptions: {
      styles: [{ color: '#6aa6ff', opacity: 0.9, weight: 6 }]
    }
  }).addTo(map);
}

function parseCoord(value) {
  const v = Number(String(value).trim());
  return Number.isFinite(v) ? v : null;
}

function setRoute(router, originLat, originLng) {
  router.setWaypoints([
    window.L.latLng(originLat, originLng),
    window.L.latLng(BUSINESS.lat, BUSINESS.lng)
  ]);
}

export function setupContactMap() {
  const root = document.querySelector('[data-contact-page]');
  if (!root) return;

  try {
    const map = createMap();
    const router = createRouter(map);

    const btnGeo = document.querySelector('[data-use-geo]');
    const btnManual = document.querySelector('[data-route-manual]');
    const latEl = /** @type {HTMLInputElement|null} */ (document.getElementById('originLat'));
    const lngEl = /** @type {HTMLInputElement|null} */ (document.getElementById('originLng'));

    const computeFromGeo = async () => {
      setStatus('Solicitando ubicación…');
      if (!navigator.geolocation) {
        setStatus('Tu navegador no soporta geolocalización. Usa coordenadas manuales.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            setRoute(router, latitude, longitude);
            setStatus('Ruta calculada desde tu ubicación.');
          } catch {
            setStatus('No se pudo calcular la ruta.');
          }
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) setStatus('Permiso denegado. Introduce coordenadas manuales.');
          else setStatus('No se pudo obtener tu ubicación. Introduce coordenadas manuales.');
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    };

    const computeFromManual = () => {
      const lat = parseCoord(latEl?.value);
      const lng = parseCoord(lngEl?.value);

      if (lat === null || lng === null) {
        setStatus('Coordenadas inválidas. Ejemplo: 40.4168 / -3.7038');
        return;
      }

      try {
        setRoute(router, lat, lng);
        setStatus('Ruta calculada desde las coordenadas indicadas.');
      } catch {
        setStatus('No se pudo calcular la ruta.');
      }
    };

    if (btnGeo) btnGeo.addEventListener('click', (ev) => { ev.preventDefault(); computeFromGeo(); });
    if (btnManual) btnManual.addEventListener('click', (ev) => { ev.preventDefault(); computeFromManual(); });

    setStatus('Mapa listo. Calcula la ruta usando tu ubicación o coordenadas.');
  } catch {
    setStatus('No se pudo inicializar el mapa (revisa conexión a internet).');
  }
}
