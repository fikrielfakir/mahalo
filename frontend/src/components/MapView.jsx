import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Layers } from 'lucide-react'

const STREET_TILE    = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const STREET_ATTR    = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const SATELLITE_TILE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const SATELLITE_ATTR = '© Esri, Maxar, Earthstar Geographics'

const DEFAULT_CENTER = [31.79, -7.09]

function fmtPrice(price) {
  if (!price) return null
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

function buildPopupHTML(m) {
  const href  = m.href || '#'
  const img   = m.image
    ? `<a href="${href}" style="display:block;text-decoration:none;"><img src="${m.image}" style="width:100%;height:110px;object-fit:cover;display:block;" /></a>`
    : ''
  const price = m.rawPrice
    ? `<div style="color:#BA1932;font-weight:700;font-size:12px;margin-bottom:2px;">${fmtPrice(m.rawPrice)} MAD</div>`
    : ''
  const sub   = m.subtitle
    ? `<div style="color:#888;font-size:11px;">${m.subtitle}</div>`
    : ''
  const title = `<a href="${href}" style="display:block;font-weight:700;font-size:13px;color:#1a2035;margin-bottom:4px;line-height:1.3;text-decoration:none;">${m.title}</a>`
  const link  = m.href
    ? `<a href="${href}" style="display:inline-block;margin-top:8px;padding:5px 14px;background:#BA1932;color:#fff;text-decoration:none;border-radius:6px;font-size:11px;font-weight:600;">View details →</a>`
    : ''
  return `<div style="font-family:system-ui,sans-serif;min-width:200px;">${img}<div style="padding:10px 12px 12px;">${title}${price}${sub}${link}</div></div>`
}

function isValidLatLng(lat, lng) {
  return (
    typeof lat === 'number' && typeof lng === 'number' &&
    isFinite(lat) && isFinite(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  )
}

function makeDivIcon(m, isActive) {
  const price = fmtPrice(m.rawPrice)
  if (price) {
    return L.divIcon({
      className: '',
      html: `<span style="
        background:${isActive ? '#730D26' : '#BA1932'};
        color:white;padding:4px 10px;border-radius:20px;
        font-size:11px;font-weight:700;white-space:nowrap;
        box-shadow:0 2px 8px rgba(0,0,0,.3);border:2px solid white;
        display:inline-flex;align-items:center;gap:3px;
        transform:${isActive ? 'scale(1.3)' : 'scale(1)'};
        transition:all .2s;letter-spacing:0.01em;cursor:pointer;
      ">${price} MAD</span>`,
      iconAnchor: [0, 0],
    })
  }
  return L.divIcon({
    className: '',
    html: `<span style="
      background:${isActive ? '#730D26' : '#BA1932'};
      width:14px;height:14px;border-radius:50%;
      display:inline-block;
      box-shadow:0 2px 8px rgba(0,0,0,.3);
      border:2px solid white;transition:all .2s;
    "></span>`,
    iconAnchor: [7, 7],
  })
}

export default function MapView({
  markers = [],
  activeId = null,
  onMarkerClick,
  center,
  zoom = 6,
  height = '100%',
}) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const tileRef      = useRef(null)
  const markersRef   = useRef({})
  const onClickRef   = useRef(onMarkerClick)
  const [isSatellite, setIsSatellite] = useState(false)

  useEffect(() => { onClickRef.current = onMarkerClick }, [onMarkerClick])

  /* ── Map initialisation ── */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // center arrives as [lng, lat] (legacy MapLibre convention) — swap for Leaflet [lat, lng]
    const initCenter = (
      Array.isArray(center) &&
      isValidLatLng(center[1], center[0])
    ) ? [center[1], center[0]] : DEFAULT_CENTER

    let map
    try {
      map = L.map(el, { center: initCenter, zoom, zoomControl: false })
    } catch (e) {
      console.warn('[MapView] init failed', e)
      return
    }

    tileRef.current = L.tileLayer(STREET_TILE, { attribution: STREET_ATTR }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map

    // Leaflet needs real pixel dimensions; call invalidateSize once the
    // container has been painted (ResizeObserver covers dynamic flex layouts)
    const ro = new ResizeObserver(() => {
      if (mapRef.current) {
        try { mapRef.current.invalidateSize() } catch (_) {}
      }
    })
    ro.observe(el)

    // Also nudge once after a brief delay as a fallback
    const t = setTimeout(() => {
      if (mapRef.current) {
        try { mapRef.current.invalidateSize() } catch (_) {}
      }
    }, 200)

    return () => {
      clearTimeout(t)
      ro.disconnect()
      Object.values(markersRef.current).forEach(mk => { try { mk.remove() } catch (_) {} })
      markersRef.current = {}
      try { map.remove() } catch (_) {}
      mapRef.current = null
      tileRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sync markers ── */
  useEffect(() => {
    if (!mapRef.current) return
    const currentIds = new Set(markers.map(m => String(m.id)))

    // Remove stale markers
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        try { markersRef.current[id].remove() } catch (_) {}
        delete markersRef.current[id]
      }
    })

    // Add new markers
    markers.forEach(m => {
      if (!isValidLatLng(m.lat, m.lng)) return
      const id = String(m.id)
      if (markersRef.current[id]) return

      try {
        const isActive = String(activeId) === id
        const marker = L.marker([m.lat, m.lng], {
          icon: makeDivIcon(m, isActive),
          riseOnHover: true,
        }).addTo(mapRef.current)
        marker.bindPopup(buildPopupHTML(m), { maxWidth: 260, offset: [0, -4] })
        marker.on('click', () => { onClickRef.current?.(m.id) })
        markersRef.current[id] = marker
      } catch (e) {
        console.warn('[MapView] failed to add marker', m.id, e)
      }
    })
  }, [markers]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Active marker highlight + flyTo ── */
  useEffect(() => {
    // Update all marker icons
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isActive = String(activeId) === id
      const m = markers.find(m => String(m.id) === id)
      if (m) {
        try { marker.setIcon(makeDivIcon(m, isActive)) } catch (_) {}
      }
    })

    if (!activeId || !mapRef.current) return

    const m = markers.find(m => String(m.id) === String(activeId))
    if (!m || !isValidLatLng(m.lat, m.lng)) return

    try {
      // Ensure Leaflet has correct pixel dimensions before any pan/zoom.
      // If the container was zero-sized at init, internal projections are NaN
      // and flyTo's rAF callbacks will throw asynchronously (uncatchable).
      mapRef.current.invalidateSize({ animate: false })

      // Only proceed if the container actually has real dimensions now.
      const sz = mapRef.current.getSize()
      if (!sz || sz.x <= 0 || sz.y <= 0) return

      // setView is synchronous (no rAF animation loop) — safe even when the
      // container just got valid dimensions for the first time.
      mapRef.current.setView([m.lat, m.lng], 14, { animate: false })

      const mk = markersRef.current[String(activeId)]
      if (mk && !mk.isPopupOpen()) mk.openPopup()
    } catch (e) {
      console.warn('[MapView] navigate to marker failed', e)
    }
  }, [activeId, markers])

  /* ── Satellite toggle ── */
  const toggleSatellite = () => {
    setIsSatellite(prev => {
      const next = !prev
      if (tileRef.current && mapRef.current) {
        try {
          tileRef.current.remove()
          tileRef.current = L.tileLayer(
            next ? SATELLITE_TILE : STREET_TILE,
            { attribution: next ? SATELLITE_ATTR : STREET_ATTR }
          ).addTo(mapRef.current)
        } catch (_) {}
      }
      return next
    })
  }

  return (
    <div style={{ position: 'relative', height, width: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <button
        onClick={toggleSatellite}
        title={isSatellite ? 'Street view' : 'Satellite view'}
        style={{
          position: 'absolute', top: 12, left: 12, zIndex: 1000,
          background: 'white', border: '1px solid rgba(0,0,0,.15)',
          borderRadius: 8, padding: '6px 10px', fontSize: 12,
          fontWeight: 600, cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: 5,
          boxShadow: '0 2px 8px rgba(0,0,0,.15)', color: '#1a2035',
        }}
      >
        <Layers size={13} />
        {isSatellite ? 'Street' : 'Satellite'}
      </button>
    </div>
  )
}
