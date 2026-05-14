import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Layers } from 'lucide-react'

const STREET_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

const SATELLITE_STYLE = {
  version: 8,
  sources: {
    esri: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: '© Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [{ id: 'bg', type: 'raster', source: 'esri' }],
}

function fmtPrice(price) {
  if (!price) return null
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

function buildPopupHTML(m) {
  const img = m.image
    ? `<img src="${m.image}" style="width:100%;height:110px;object-fit:cover;display:block;" />`
    : ''
  const price = m.rawPrice
    ? `<div style="color:#BA1932;font-weight:700;font-size:12px;margin-bottom:2px;">${fmtPrice(m.rawPrice)} MAD</div>`
    : ''
  const sub = m.subtitle
    ? `<div style="color:#888;font-size:11px;">${m.subtitle}</div>`
    : ''
  const link = m.href
    ? `<a href="${m.href}" style="display:inline-block;margin-top:8px;padding:5px 14px;background:#BA1932;color:#fff;text-decoration:none;border-radius:6px;font-size:11px;font-weight:600;">View →</a>`
    : ''
  return `<div style="font-family:system-ui,sans-serif;min-width:200px;">${img}<div style="padding:10px 12px 12px;"><div style="font-weight:700;font-size:13px;color:#1a2035;margin-bottom:4px;line-height:1.3;">${m.title}</div>${price}${sub}${link}</div></div>`
}

function makeMarkerEl(m, onClickFn) {
  const el = document.createElement('div')
  el.style.cursor = 'pointer'
  const price = fmtPrice(m.rawPrice)
  const span = document.createElement('span')
  span.dataset.markerId = String(m.id)
  if (price) {
    span.textContent = price
    Object.assign(span.style, {
      background: '#BA1932',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 8px rgba(0,0,0,.3)',
      border: '2px solid white',
      display: 'inline-block',
      transition: 'all .2s',
    })
  } else {
    Object.assign(span.style, {
      background: '#BA1932',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      display: 'inline-block',
      boxShadow: '0 2px 8px rgba(0,0,0,.3)',
      border: '2px solid white',
      transition: 'all .2s',
    })
  }
  el.appendChild(span)
  if (onClickFn) {
    el.addEventListener('click', (e) => { e.stopPropagation(); onClickFn(m.id) })
  }
  return el
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
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const onClickRef = useRef(onMarkerClick)
  const [isSatellite, setIsSatellite] = useState(false)

  useEffect(() => { onClickRef.current = onMarkerClick }, [onMarkerClick])

  useEffect(() => {
    if (!containerRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STREET_STYLE,
      center: center || [-7.09, 31.79],
      zoom,
      attributionControl: false,
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
    mapRef.current = map
    return () => {
      Object.values(markersRef.current).forEach(m => m.remove())
      markersRef.current = {}
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    const currentIds = new Set(markers.map(m => String(m.id)))
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })
    markers.forEach(m => {
      if (!m.lat || !m.lng || isNaN(m.lat) || isNaN(m.lng)) return
      const id = String(m.id)
      if (markersRef.current[id]) return
      const el = makeMarkerEl(m, (id) => onClickRef.current?.(id))
      const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '260px', offset: 12 })
        .setHTML(buildPopupHTML(m))
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([m.lng, m.lat])
        .setPopup(popup)
        .addTo(mapRef.current)
      markersRef.current[id] = marker
    })
  }, [markers])

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const span = marker.getElement().querySelector('span')
      if (!span) return
      const isActive = String(activeId) === id
      span.style.background = isActive ? '#730D26' : '#BA1932'
      span.style.transform = isActive ? 'scale(1.3)' : 'scale(1)'
      span.style.zIndex = isActive ? '10' : '1'
    })
    if (activeId && mapRef.current) {
      const m = markers.find(m => String(m.id) === String(activeId))
      if (m?.lat && m?.lng) {
        mapRef.current.flyTo({ center: [m.lng, m.lat], zoom: 14, duration: 800 })
        const mk = markersRef.current[String(activeId)]
        if (mk && !mk.getPopup().isOpen()) mk.togglePopup()
      }
    }
  }, [activeId, markers])

  const toggleSatellite = () => {
    setIsSatellite(prev => {
      const next = !prev
      mapRef.current?.setStyle(next ? SATELLITE_STYLE : STREET_STYLE)
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
          position: 'absolute', top: 12, left: 12, zIndex: 10,
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
