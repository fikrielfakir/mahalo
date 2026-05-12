import { useRef, useState, useCallback } from 'react'
import { Upload, X, Link, Plus, AlertCircle, GripVertical } from 'lucide-react'
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
    <svg width="40" height="40" className="rotate-[-90deg]">
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

  const addUrls = (paths) => {
    const cleaned = paths.filter(Boolean).filter(p => !images.includes(p))
    onChange([...images, ...cleaned])
  }

  const removeImage = (idx) => {
    const next = images.filter((_, i) => i !== idx)
    onChange(next)
  }

  const uploadFile = useCallback(async (file) => {
    const id = Math.random().toString(36).slice(2)
    setUploading((prev) => [...prev, { id, name: file.name, pct: 0, error: null }])

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
      addUrls([res.data?.path])
      setUploading((prev) => prev.filter((u) => u.id !== id))
    } catch {
      setUploading((prev) => prev.filter((u) => u.id !== id))
      setErrors((prev) => [...prev, `Failed to upload ${file.name}`])
      setTimeout(() => setErrors((prev) => prev.filter((_, i) => i !== 0)), 4000)
    }
  }, [folder, images, onChange])

  const handleFiles = useCallback((files) => {
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .forEach(uploadFile)
  }, [uploadFile])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const addUrl = () => {
    const url = urlInput.trim()
    if (url) { addUrls([url]); setUrlInput('') }
    setShowUrl(false)
  }

  return (
    <div className="space-y-3">
      {/* Thumbnails grid */}
      {(images.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
              <img
                src={getDisplayUrl(img)}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-[#C8A97E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                  MAIN
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={10} />
              </button>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}

          {uploading.map((u) => (
            <div key={u.id} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 flex items-center justify-center">
              <ProgressRing pct={u.pct} />
              <p className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-gray-500 truncate px-1">{u.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Error messages */}
      {errors.map((err, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">
          <AlertCircle size={13} />
          {err}
        </div>
      ))}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-6 cursor-pointer transition-all select-none ${
          dragging
            ? 'border-[#C8A97E] bg-[#C8A97E]/5'
            : 'border-gray-200 hover:border-[#C8A97E]/60 hover:bg-gray-50'
        }`}
      >
        <Upload size={22} className={`mb-2 transition-colors ${dragging ? 'text-[#C8A97E]' : 'text-gray-300'}`} />
        <p className="text-sm font-medium text-gray-500">
          {dragging ? 'Drop to upload' : 'Drag & drop images here'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">or click to browse — JPG, PNG, WEBP up to 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* URL input row */}
      <div className="flex gap-2">
        {showUrl ? (
          <div className="flex gap-2 flex-1">
            <input
              autoFocus
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl() } if (e.key === 'Escape') setShowUrl(false) }}
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
              onClick={() => setShowUrl(false)}
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
          {images.length} image{images.length !== 1 ? 's' : ''} — first image is the main photo
        </p>
      )}
    </div>
  )
}
