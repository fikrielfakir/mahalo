import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPin, X } from 'lucide-react'

const STREET_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

const MOROCCO_BOUNDS = [[-17.5, 20.5], [0.5, 36.5]]
const MOROCCO_CENTER = [-7.09, 31.79]

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
      try {
        const mapOptions = {
          container: containerRef.current,
          style: STREET_STYLE,
          center: latNum && lngNum ? [lngNum, latNum] : MOROCCO_CENTER,
          zoom: latNum && lngNum ? 13 : 5,
          attributionControl: false,
        }
        if (restrictToMorocco) {
          mapOptions.maxBounds = MOROCCO_BOUNDS
          mapOptions.minZoom = 4
        }
        map = new maplibregl.Map(mapOptions)
      } catch (_) {
        return
      }

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

      if (latNum && lngNum) {
        markerRef.current = new maplibregl.Marker({ color: '#BA1932', draggable: true })
          .setLngLat([lngNum, latNum])
          .addTo(map)
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current.getLngLat()
          onChange({ lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) })
        })
      }

      map.on('click', (e) => {
        const { lng: clickLng, lat: clickLat } = e.lngLat
        if (!markerRef.current) {
          markerRef.current = new maplibregl.Marker({ color: '#BA1932', draggable: true })
            .setLngLat([clickLng, clickLat])
            .addTo(map)
          markerRef.current.on('dragend', () => {
            const pos = markerRef.current.getLngLat()
            onChange({ lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) })
          })
        } else {
          markerRef.current.setLngLat([clickLng, clickLat])
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
      markerRef.current = new maplibregl.Marker({ color: '#BA1932', draggable: true })
        .setLngLat([lngNum, latNum])
        .addTo(mapRef.current)
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current.getLngLat()
        onChange({ lat: pos.lat.toFixed(6), lng: pos.lng.toFixed(6) })
      })
    } else {
      markerRef.current.setLngLat([lngNum, latNum])
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
              transform: 'translateX(-50%)', zIndex: 5, pointerEvents: 'none',
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
