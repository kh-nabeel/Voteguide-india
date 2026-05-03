/**
 * MapPage.jsx
 * 
 * WHY THIS EXISTS:
 * Integrates the Google Maps JavaScript API to provide spatial context for electoral 
 * offices. We implemented a robust fallback mechanism (using the Google Maps Embed API) 
 * so that if the JavaScript API fails (e.g., due to strict browser tracking protection 
 * or network drops), the user still receives functional location data. This dual-layer 
 * approach guarantees high availability.
 *
 * Google Services used:
 *  - Google Maps JavaScript API  — interactive map with custom markers
 *  - Google Maps Embed API       — fallback iframe embed
 *  - Google Analytics 4          — tracks office_selected events
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ECI_OFFICES }  from '../data/electionData.js';
import { useAnalytics } from '../hooks/useGoogleServices.js';
import FeedbackWidget   from '../components/FeedbackWidget.jsx';

/** Google Maps API key sourced from Vite env variable (set in .env) */
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/** India centre coordinates */
const INDIA_CENTER  = { lat: 22.5, lng: 82.5 };
const INDIA_ZOOM    = 5;
const SELECTED_ZOOM = 13;

/** Load the Maps JS API script once, globally — safe across hot-reloads & Strict Mode */
function loadMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.google?.maps?.Map) { resolve(); return; }

    // Script already in DOM (e.g. from previous mount)
    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existing) {
      const check = setInterval(() => {
        if (window.google?.maps?.Map) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }

    window.initGoogleMapCallback = () => {
      resolve();
      delete window.initGoogleMapCallback;
    };

    const script   = document.createElement('script');
    script.src     = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapCallback`;
    script.async   = true;
    script.defer   = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function MapPage() {
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [mapReady,       setMapReady]       = useState(false);
  const [mapError,       setMapError]       = useState(false);

  const mapRef       = useRef(null);  // DOM node for the map canvas
  const googleMapRef = useRef(null);  // google.maps.Map instance
  const markersRef   = useRef([]);    // all marker instances
  const infoWindowRef = useRef(null);

  const { trackEvent } = useAnalytics();

  // ── Load Google Maps JS API ──────────────────────────────────────────────────
  useEffect(() => {
    if (!MAPS_API_KEY) { setMapError(true); return; }

    loadMapsScript(MAPS_API_KEY)
      .then(() => setMapReady(true))
      .catch(() => setMapError(true));
  }, []);

  // ── Initialise map once API is ready ────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) {return;}
    // If already initialised (Strict Mode double-invoke), just resize
    if (googleMapRef.current) {
      window.google.maps.event.trigger(googleMapRef.current, 'resize');
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center:    INDIA_CENTER,
      zoom:      INDIA_ZOOM,
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    });

    googleMapRef.current = map;
    infoWindowRef.current = new window.google.maps.InfoWindow();

    ECI_OFFICES.forEach((office) => {
      const marker = new window.google.maps.Marker({
        position: { lat: office.lat, lng: office.lng },
        map,
        title: office.state,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor:    '#FF6200',
          fillOpacity:  1,
          strokeColor:  '#FFFFFF',
          strokeWeight: 2,
          scale:        9,
        },
      });

      marker.addListener('click', () => {
        infoWindowRef.current.setContent(`
          <div style="max-width:220px;font-family:Arial,sans-serif;padding:4px 0;">
            <strong style="color:#003087;font-size:14px;">${office.state}</strong><br/>
            <span style="font-size:12px;color:#444;line-height:1.5;">${office.address}</span><br/>
            <span style="font-size:12px;color:#047A3A;margin-top:6px;display:block;">📞 ${office.phone}</span>
          </div>
        `);
        infoWindowRef.current.open(map, marker);
        handleOfficeSelect(office);
      });

      markersRef.current.push(marker);
    });
  }, [mapReady]);  

  // ── Fly map to a selected office ────────────────────────────────────────────
  const flyToOffice = useCallback((office) => {
    if (!googleMapRef.current) {return;}
    googleMapRef.current.panTo({ lat: office.lat, lng: office.lng });
    googleMapRef.current.setZoom(SELECTED_ZOOM);
  }, []);

  const handleOfficeSelect = useCallback((office) => {
    setSelectedOffice(office);
    flyToOffice(office);
    trackEvent('office_selected', { state: office.state });
  }, [flyToOffice, trackEvent]);

  // ── Filter offices by search query ──────────────────────────────────────────
  const filteredOffices = ECI_OFFICES.filter((o) =>
    o.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Reset map to India view ──────────────────────────────────────────────────
  const resetMap = () => {
    if (googleMapRef.current) {
      googleMapRef.current.panTo(INDIA_CENTER);
      googleMapRef.current.setZoom(INDIA_ZOOM);
    }
    if (infoWindowRef.current) {infoWindowRef.current.close();}
    setSelectedOffice(null);
  };

  // ── Google Maps Embed fallback URL ──────────────────────────────────────────
  const embedUrl = selectedOffice
    ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${encodeURIComponent(selectedOffice.address)}&zoom=14`
    : `https://www.google.com/maps/embed/v1/view?key=${MAPS_API_KEY}&center=${INDIA_CENTER.lat},${INDIA_CENTER.lng}&zoom=5&maptype=roadmap`;

  return (
    <div className="map-page">
      <h1 className="page__title">ECI Office Locator</h1>
      <p className="page__lead">
        Find the Chief Electoral Officer (CEO) office in your state. Click a
        state in the list or a marker on the map to see the full address and
        phone number.
      </p>

      <div className="info-box info-box--blue" style={{ marginBottom: '20px' }}>
        <strong>🗺️ Powered by Google Maps.</strong> This map shows all 32 state and UT-level
        Election Commission offices across India. For district-level offices, visit{' '}
        <a href="https://www.eci.gov.in/contact-us/" target="_blank" rel="noopener noreferrer">
          eci.gov.in/contact-us
        </a>.
      </div>

      {/* ── Map Layout ── */}
      <div className="map-layout">

        {/* Sidebar */}
        <aside className="map-sidebar" aria-label="State offices list">
          <div className="map-sidebar__header">
            🏢 State / UT CEO Offices ({ECI_OFFICES.length})
          </div>

          {/* Search */}
          <div className="map-sidebar__search">
            <input
              type="search"
              placeholder="Search state or city…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search states and cities"
            />
          </div>

          {/* Reset button */}
          {selectedOffice && (
            <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--c-border)' }}>
              <button
                className="btn btn--outline"
                onClick={resetMap}
                style={{ width: '100%', fontSize: '13px', padding: '6px' }}
              >
                ← Show All India
              </button>
            </div>
          )}

          {/* Office list */}
          <ul className="map-sidebar__list" role="list">
            {filteredOffices.length === 0 ? (
              <li style={{ padding: '16px', color: 'var(--c-text-muted)', fontSize: '14px' }}>
                No offices match your search.
              </li>
            ) : (
              filteredOffices.map((office) => (
                <li
                  key={office.state}
                  role="listitem"
                >
                  <button
                    className={`office-item${selectedOffice?.state === office.state ? ' office-item--active' : ''}`}
                    onClick={() => handleOfficeSelect(office)}
                    aria-pressed={selectedOffice?.state === office.state}
                    aria-label={`Select ${office.state} office`}
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <div className="office-item__state">{office.state}</div>
                    <div className="office-item__address">{office.city} · {office.ceo}</div>
                    <div className="office-item__phone">📞 {office.phone}</div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Right column: map + info panel stacked */}
        <div className="map-right-col">

          {/* Map Panel */}
          <div className="map-container" aria-label="Google Map showing ECI offices">

            {/* Google Maps JS API — primary */}
            {!mapError && (
              <div
                ref={mapRef}
                style={{ width: '100%', height: '100%' }}
                aria-label="Interactive Google Map"
              />
            )}

            {/* Embed API fallback — shown when JS API fails but key exists */}
            {mapError && MAPS_API_KEY && (
              <iframe
                title="ECI Office Location"
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}

            {/* No key at all — instructional placeholder */}
            {mapError && !MAPS_API_KEY && (
              <div
                style={{
                  width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'var(--c-blue-light)', gap: '16px',
                  padding: '32px', textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '48px' }}>🗺️</span>
                <h3 style={{ color: 'var(--c-blue)', fontSize: '20px' }}>Google Maps Not Configured</h3>
                <p style={{ color: 'var(--c-text-sec)', maxWidth: '360px' }}>
                  Add your Google Maps API key as{' '}
                  <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>
                    VITE_GOOGLE_MAPS_API_KEY
                  </code>{' '}
                  in your <code>.env</code> file and rebuild to enable the map.
                </p>
                <a
                  href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  Get a Maps API Key →
                </a>
              </div>
            )}
          </div>

          {/* Selected office info panel — OUTSIDE map-container, below the map */}
          {selectedOffice && (
            <div className="map-info-panel" aria-live="polite" aria-label="Selected office details">
              <div className="map-info-panel__inner">
                <div>
                  <h3>{selectedOffice.state}</h3>
                  <p>{selectedOffice.address}</p>
                  <p className="map-info-panel__phone">📞 {selectedOffice.phone}</p>
                </div>
                <div className="map-info-panel__actions">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOffice.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                    style={{ fontSize: '13px', padding: '8px 14px' }}
                  >
                    Open in Google Maps ↗
                  </a>
                  <button
                    className="btn btn--outline"
                    onClick={resetMap}
                    style={{ fontSize: '13px', padding: '8px 14px' }}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Helpline reminder ── */}
      <div className="info-box info-box--orange" style={{ marginTop: '24px' }}>
        <strong>📞 National Voter Helpline: 1950</strong> — Call this free number from anywhere in
        India for voter registration, booth location, complaints, and general election queries.
        Available in multiple Indian languages.
      </div>

      <FeedbackWidget page="map" />
    </div>
  );
}
