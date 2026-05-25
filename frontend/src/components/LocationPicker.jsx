import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, X } from 'lucide-react'

const STREET_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const STREET_ATTR = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const MOROCCO_CENTER = [31.79, -7.09]
const MOROCCO_BOUNDS = L.latLngBounds(
  L.latLng(20.5, -17.5),
  L.latLng(36.5, 0.5)
)

const PIN_ICON = L.divIcon({
  className: '',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="#BA1932"/>
    <circle cx="14" cy="14" r="6" fill="white"/>
  </svg>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
})

export default function LocationPicker({ lat, lng, onChange, height = 280, restrictToMorocco = false }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const markerRef    = useRef(null)

  const latNum = parseFloat(lat) || null
  const lngNum = parseFloat(lng) || null

  useEffect(() => {
    let map = null
    let timer = null

    const init = () => {
      if (!containerRef.current) return

      const center = latNum && lngNum ? [latNum, lngNum] : MOROCCO_CENTER
      const initZoom = latNum && lngNum ? 13 : 5

      map = L.map(containerRef.current, {
        center,
        zoom: initZoom,
        zoomControl: false,
        ...(restrictToMorocco ? { maxBounds: MOROCCO_BOUNDS, minZoom: 4 } : {}),
      })

      L.tileLayer(STREET_TILE, { attribution: STREET_ATTR }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      if (latNum && lngNum) {
        markerRef.current = L.marker([latNum, lngNum], { icon: PIN_ICON, draggable: true }).addTo(map)
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current.getLatLng()
          onChange({ lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) })
        })
      }

      map.on('click', (e) => {
        const { lat: clickLat, lng: clickLng } = e.latlng
        if (!markerRef.current) {
          markerRef.current = L.marker([clickLat, clickLng], { icon: PIN_ICON, draggable: true }).addTo(map)
          markerRef.current.on('dragend', () => {
            const pos = markerRef.current.getLatLng()
            onChange({ lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) })
          })
        } else {
          markerRef.current.setLatLng([clickLat, clickLng])
        }
        onChange({ lat: clickLat.toFixed(6), lng: clickLng.toFixed(6) })
      })

      mapRef.current = map
    }

    const el = containerRef.current
    if (el && el.offsetWidth > 0) {
      init()
    } else {
      timer = setTimeout(init, 150)
    }

    return () => {
      clearTimeout(timer)
      markerRef.current = null
      mapRef.current = null
      map?.remove()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mapRef.current || !latNum || !lngNum) return
    if (!markerRef.current) {
      markerRef.current = L.marker([latNum, lngNum], { icon: PIN_ICON, draggable: true }).addTo(mapRef.current)
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLatLng()
        onChange({ lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) })
      })
    } else {
      markerRef.current.setLatLng([latNum, lngNum])
    }
  }, [latNum, lngNum]) // eslint-disable-line react-hooks/exhaustive-deps

  const clear = (e) => {
    e.stopPropagation()
    markerRef.current?.remove()
    markerRef.current = null
    onChange({ lat: '', lng: '' })
  }

  return (
    <div>
      <div
        className="relative rounded-2xl overflow-hidden border border-gray-200"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        {!latNum && !lngNum && (
          <div
            style={{
              position: 'absolute', bottom: 10, left: '50%',
              transform: 'translateX(-50%)', zIndex: 1000, pointerEvents: 'none',
            }}
          >
            <span style={{
              background: 'rgba(0,0,0,.6)', color: 'white', borderRadius: 20,
              padding: '5px 14px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              Click on the map to place a pin
            </span>
          </div>
        )}
      </div>

      {latNum && lngNum && (
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <MapPin size={12} className="text-[#BA1932] shrink-0" />
          <span className="tabular-nums">{latNum.toFixed(6)}, {lngNum.toFixed(6)}</span>
          <button type="button" onClick={clear}
            className="flex items-center gap-0.5 text-red-400 hover:text-red-600 transition-colors ml-auto">
            <X size={11} /> Clear
          </button>
        </div>
      )}
    </div>
  )
}
