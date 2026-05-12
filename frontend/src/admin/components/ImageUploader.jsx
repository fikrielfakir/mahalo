import { useRef, useState, useCallback, useEffect } from 'react'
import { Upload, X, Link, AlertCircle, Star } from 'lucide-react'
import axios from 'axios'

const client = axios.create({ baseURL: '/api/v1' })
client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('admin_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

function getDisplayUrl(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('blob:')) return path
  return `/storage/${path}`
}

function ProgressRing({ pct }) {
  const r = 16
  const circ = 2 * Math.PI * r
  return (
    <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="20" cy="20" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
      <circle
        cx="20" cy="20" r={r} fill="none" stroke="#C8A97E" strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.2s' }}
      />
      <text x="20" y="20" fill="#0B1F3A" fontSize="9" fontWeight="600"
        textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}>
        {pct}%
      </text>
    </svg>
  )
}

export default function ImageUploader({ images = [], onChange, folder = 'properties' }) {
  const [dragging, setDragging]   = useState(false)
  const [urlInput, setUrlInput]   = useState('')
  const [showUrl, setShowUrl]     = useState(false)
  const [uploading, setUploading] = useState([])
  const [errors, setErrors]       = useState([])
  const inputRef = useRef()

  // Always-fresh refs so async callbacks never have stale closures
  const imagesRef  = useRef(images)
  const onChangeRef = useRef(onChange)
  useEffect(() => { imagesRef.current = images }, [images])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  const removeImage = (idx) => {
    const next = images.filter((_, i) => i !== idx)
    onChange(next)
  }

  const setAsMain = (idx) => {
    if (idx === 0) return
    const next = [...images]
    const [item] = next.splice(idx, 1)
    next.unshift(item)
    onChange(next)
  }

  const uploadFile = useCallback(async (file) => {
    const id = Math.random().toString(36).slice(2)
    setUploading((prev) => [...prev, { id, name: file.name, pct: 0 }])

    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)

    try {
      const res = await client.post('/admin/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded / e.total) * 100)
          setUploading((prev) => prev.map((u) => u.id === id ? { ...u, pct } : u))
        },
      })
      const path = res.data?.path
      if (path) {
        // Use refs so we always append to the latest images list
        const latest = imagesRef.current
        if (!latest.includes(path)) {
          onChangeRef.current([...latest, path])
        }
      }
      setUploading((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      setUploading((prev) => prev.filter((u) => u.id !== id))
      const msg = err?.response?.data?.message || `Failed to upload ${file.name}`
      setErrors((prev) => [...prev, msg])
      setTimeout(() => setErrors((prev) => prev.slice(1)), 5000)
    }
  }, [folder])

  const handleFiles = useCallback((files) => {
    Array.from(files).filter((f) => f.type.startsWith('image/')).forEach(uploadFile)
  }, [uploadFile])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const addUrl = () => {
    const url = urlInput.trim()
    if (url && !images.includes(url)) onChange([...images, url])
    setUrlInput('')
    setShowUrl(false)
  }

  return (
    <div className="space-y-3">

      {/* Thumbnail grid */}
      {(images.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-4 gap-2">

          {images.map((img, idx) => (
            <div key={`${img}-${idx}`} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 group">
              <img
                src={getDisplayUrl(img)}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />

              {/* MAIN badge */}
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-[#C8A97E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none pointer-events-none z-10">
                  MAIN
                </span>
              )}

              {/* Set as main star — shown on non-main images on hover */}
              {idx !== 0 && (
                <button
                  type="button"
                  title="Set as main photo"
                  onClick={(e) => { e.stopPropagation(); setAsMain(idx) }}
                  className="absolute bottom-1.5 left-1.5 w-6 h-6 bg-white/90 text-amber-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow hover:bg-white hover:scale-110 active:scale-95"
                >
                  <Star size={11} />
                </button>
              )}

              {/* Remove button */}
              <button
                type="button"
                title="Remove image"
                onClick={(e) => { e.stopPropagation(); removeImage(idx) }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow hover:bg-red-600 hover:scale-110 active:scale-95"
              >
                <X size={11} />
              </button>
            </div>
          ))}

          {/* Upload progress placeholders */}
          {uploading.map((u) => (
            <div key={u.id} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 flex flex-col items-center justify-center gap-1">
              <ProgressRing pct={u.pct} />
              <p className="text-[9px] text-gray-400 truncate w-full text-center px-1">{u.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.map((err, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <AlertCircle size={13} className="shrink-0" />
          {err}
        </div>
      ))}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-6 cursor-pointer transition-all select-none ${
          dragging
            ? 'border-[#C8A97E] bg-[#C8A97E]/5'
            : 'border-gray-200 hover:border-[#C8A97E]/60 hover:bg-gray-50'
        }`}
      >
        <Upload size={22} className={`mb-2 transition-colors ${dragging ? 'text-[#C8A97E]' : 'text-gray-300'}`} />
        <p className="text-sm font-medium text-gray-500">
          {dragging ? 'Drop to upload' : 'Drag & drop images here'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">or click to browse — JPG, PNG, WEBP up to 20 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />
      </div>

      {/* Add URL row */}
      <div className="flex gap-2">
        {showUrl ? (
          <div className="flex gap-2 flex-1">
            <input
              autoFocus
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addUrl() }
                if (e.key === 'Escape') { setShowUrl(false); setUrlInput('') }
              }}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 outline-none focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/20 transition-all placeholder-gray-400"
            />
            <button
              type="button"
              onClick={addUrl}
              className="px-4 py-2 bg-[#0B1F3A] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setShowUrl(false); setUrlInput('') }}
              className="px-3 py-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUrl(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 hover:text-[#0B1F3A] border border-gray-200 rounded-xl hover:border-[#0B1F3A]/30 transition-all"
          >
            <Link size={13} />
            Add image URL
          </button>
        )}
      </div>

      {images.length > 0 && (
        <p className="text-xs text-gray-400">
          {images.length} image{images.length !== 1 ? 's' : ''} · hover a thumbnail to remove or
          <Star size={9} className="inline mx-0.5 text-amber-400 fill-amber-400" />
          set as main
        </p>
      )}
    </div>
  )
}
