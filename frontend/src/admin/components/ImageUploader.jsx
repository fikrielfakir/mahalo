import { useRef, useState, useCallback, useEffect } from 'react'
import { Upload, X, Link, AlertCircle, Star, Video, Droplets } from 'lucide-react'
import axios from 'axios'
import { isVideoPath, mediaUrl } from '../../utils/media'

const client = axios.create({ baseURL: '/api/v1' })
client.interceptors.request.use((cfg) => {
  const token = (
    (localStorage.getItem('admin_token') ?? null) ||
    (localStorage.getItem('user_token') ?? null)
  )
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

function getDisplayUrl(path) {
  if (!path) return ''
  return mediaUrl(path)
}

function ProgressRing({ pct }) {
  const r = 16
  const circ = 2 * Math.PI * r
  return (
    <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="20" cy="20" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
      <circle
        cx="20" cy="20" r={r} fill="none" stroke="#BA1932" strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.2s' }}
      />
      <text x="20" y="20" fill="#730D26" fontSize="9" fontWeight="600"
        textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}>
        {pct}%
      </text>
    </svg>
  )
}

// ─── Load the watermark logo from site settings ───────────────────────────────
async function loadWatermarkLogo() {
  let logoUrl = '/watermark.png'
  try {
    const res = await client.get('/admin/settings')
    const url = res?.data?.watermark_logo_url || res?.watermark_logo_url
    if (url) logoUrl = url
  } catch (_) {}

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = () => {
      // retry without crossOrigin (same-origin logo)
      const img2 = new Image()
      img2.onload  = () => resolve(img2)
      img2.onerror = () => resolve(null)
      img2.src = logoUrl
    }
    img.src = logoUrl
  })
}

// ─── Draw logo centered on canvas frame (identical to image watermark style) ──
function drawLogoWatermark(ctx, W, H, logoImg) {
  if (!logoImg) return
  const logoW  = Math.round(W * 0.30)                                  // 30% of video width
  const logoH  = Math.round((logoImg.naturalHeight / logoImg.naturalWidth) * logoW)
  const x      = Math.round((W - logoW) / 2)
  const y      = Math.round((H - logoH) / 2)
  ctx.save()
  ctx.globalAlpha = 0.50                                                // 50% opacity like image
  ctx.drawImage(logoImg, x, y, logoW, logoH)
  ctx.restore()
}

// ─── Burn logo watermark into every frame of the video ───────────────────────
async function burnWatermarkIntoVideo(file, logoImg, onProgress) {
  return new Promise((resolve) => {
    if (
      typeof MediaRecorder === 'undefined' ||
      (!MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') &&
       !MediaRecorder.isTypeSupported('video/webm'))
    ) {
      resolve(file)   // browser unsupported — upload original
      return
    }

    const video       = document.createElement('video')
    video.muted       = true
    video.playsInline = true
    video.preload     = 'auto'
    const objectUrl   = URL.createObjectURL(file)
    video.src         = objectUrl

    video.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file) }

    video.onloadedmetadata = () => {
      const W = video.videoWidth  || 1280
      const H = video.videoHeight || 720

      const canvas  = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx     = canvas.getContext('2d')

      const stream  = canvas.captureStream(30)
      const mime    = ['video/webm;codecs=vp8,opus', 'video/webm;codecs=vp8', 'video/webm']
        .find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm'

      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 })
      const chunks   = []
      recorder.ondataavailable = e => { if (e.data?.size > 0) chunks.push(e.data) }

      recorder.onstop = () => {
        URL.revokeObjectURL(objectUrl)
        const blob = new Blob(chunks, { type: mime })
        const out  = new File([blob], file.name.replace(/\.[^.]+$/, '.webm'), { type: mime })
        resolve(out)
      }

      const drawFrame = () => {
        ctx.drawImage(video, 0, 0, W, H)
        drawLogoWatermark(ctx, W, H, logoImg)
      }

      let rafId
      const loop = () => {
        if (video.paused || video.ended) return
        drawFrame()
        if (onProgress && video.duration) {
          onProgress(Math.min(99, Math.round((video.currentTime / video.duration) * 100)))
        }
        rafId = requestAnimationFrame(loop)
      }

      video.onended = () => {
        cancelAnimationFrame(rafId)
        drawFrame()
        if (onProgress) onProgress(100)
        recorder.stop()
      }

      video.oncanplaythrough = () => {
        recorder.start(200)
        video.play()
          .then(() => { rafId = requestAnimationFrame(loop) })
          .catch(() => { URL.revokeObjectURL(objectUrl); resolve(file) })
      }
    }
  })
}

// ─── Capture thumbnail from first second of video ────────────────────────────
async function captureVideoThumbnail(file) {
  return new Promise((resolve) => {
    const video       = document.createElement('video')
    video.preload     = 'metadata'
    video.muted       = true
    video.playsInline = true
    const url         = URL.createObjectURL(file)
    video.src         = url

    video.onloadeddata = () => {
      video.currentTime = Math.min(1, (video.duration || 2) * 0.1)
    }
    video.onseeked = () => {
      const canvas  = document.createElement('canvas')
      canvas.width  = 640
      canvas.height = Math.round((640 / (video.videoWidth || 640)) * (video.videoHeight || 360))
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => { URL.revokeObjectURL(url); resolve(blob) }, 'image/jpeg', 0.85)
    }
    video.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
  })
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ImageUploader({ images = [], onChange, folder = 'properties', allowVideo = false }) {
  const [dragging, setDragging]   = useState(false)
  const [urlInput, setUrlInput]   = useState('')
  const [showUrl, setShowUrl]     = useState(false)
  const [uploading, setUploading] = useState([])
  const [errors, setErrors]       = useState([])
  const [thumbMap, setThumbMap]   = useState({})
  const inputRef  = useRef()
  const logoRef   = useRef(null)   // cached logo Image element

  const imagesRef   = useRef(images)
  const onChangeRef = useRef(onChange)
  useEffect(() => { imagesRef.current   = images  }, [images])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  // Pre-load watermark logo when video upload is enabled
  useEffect(() => {
    if (!allowVideo || logoRef.current !== null) return
    loadWatermarkLogo().then(img => { logoRef.current = img })
  }, [allowVideo])

  // Fetch thumbnail URLs for any video paths already in the list
  useEffect(() => {
    const videoPaths = images.filter(isVideoPath).filter(p => !thumbMap[p])
    if (!videoPaths.length) return
    client.get('/admin/media', { params: { per_page: 200 } })
      .then(res => {
        const items = res.data?.data ?? []
        const map   = {}
        items.forEach(item => {
          if (item.thumbnail_url && videoPaths.includes(item.path))
            map[item.path] = item.thumbnail_url
        })
        if (Object.keys(map).length) setThumbMap(m => ({ ...m, ...map }))
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join(',')])

  const removeImage = idx => onChange(images.filter((_, i) => i !== idx))

  const setAsMain = idx => {
    if (idx === 0) return
    const next = [...images]
    const [item] = next.splice(idx, 1)
    next.unshift(item)
    onChange(next)
  }

  const uploadFile = useCallback(async (file) => {
    const id      = Math.random().toString(36).slice(2)
    const isVideo = file.type.startsWith('video/')

    setUploading(prev => [...prev, {
      id, name: file.name, pct: 0,
      stage: isVideo ? 'Adding watermark…' : 'Uploading…',
    }])

    try {
      let uploadableFile = file

      if (isVideo) {
        // Ensure logo is loaded before processing
        if (logoRef.current === null) {
          logoRef.current = await loadWatermarkLogo()
        }

        // Burn logo onto every frame
        uploadableFile = await burnWatermarkIntoVideo(
          file,
          logoRef.current,
          (wPct) => setUploading(prev => prev.map(u =>
            u.id === id
              ? { ...u, pct: Math.round(wPct * 0.6), stage: `Adding watermark… ${wPct}%` }
              : u
          ))
        )

        setUploading(prev => prev.map(u =>
          u.id === id ? { ...u, pct: 62, stage: 'Generating thumbnail…' } : u
        ))
      }

      const fd = new FormData()
      fd.append('file', uploadableFile)
      fd.append('folder', folder)

      if (isVideo) {
        const thumbBlob = await captureVideoThumbnail(uploadableFile)
        if (thumbBlob) fd.append('thumbnail', thumbBlob, 'thumb.jpg')
        setUploading(prev => prev.map(u =>
          u.id === id ? { ...u, pct: 65, stage: 'Uploading…' } : u
        ))
      }

      const res = await client.post('/admin/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const up    = Math.round((e.loaded / e.total) * 100)
          const total = isVideo ? 65 + Math.round(up * 0.35) : up
          setUploading(prev => prev.map(u =>
            u.id === id ? { ...u, pct: total, stage: 'Uploading…' } : u
          ))
        },
      })

      const path     = res.data?.path
      const thumbUrl = res.data?.data?.thumbnail_url
      if (path) {
        const latest = imagesRef.current
        if (!latest.includes(path)) onChangeRef.current([...latest, path])
        if (thumbUrl) setThumbMap(m => ({ ...m, [path]: thumbUrl }))
      }
      setUploading(prev => prev.filter(u => u.id !== id))

    } catch (err) {
      setUploading(prev => prev.filter(u => u.id !== id))
      const msg = err?.response?.data?.message || `Failed to upload ${file.name}`
      setErrors(prev => [...prev, msg])
      setTimeout(() => setErrors(prev => prev.slice(1)), 5000)
    }
  }, [folder])

  const acceptedTypes = allowVideo
    ? 'image/*,video/mp4,video/quicktime,video/x-msvideo,video/webm,video/mkv'
    : 'image/*'

  const handleFiles = useCallback((files) => {
    Array.from(files).forEach(f => {
      const isImg = f.type.startsWith('image/')
      const isVid = f.type.startsWith('video/')
      if (!isImg && !isVid) return
      if (isVid && !allowVideo) return
      if (isVid && f.size > 100 * 1024 * 1024) {
        setErrors(prev => [...prev, `${f.name} exceeds 100 MB limit`])
        setTimeout(() => setErrors(prev => prev.slice(1)), 5000)
        return
      }
      uploadFile(f)
    })
  }, [uploadFile, allowVideo])

  const onDrop = e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }

  const addUrl = () => {
    const url = urlInput.trim()
    if (url && !images.includes(url)) onChange([...images, url])
    setUrlInput('')
    setShowUrl(false)
  }

  return (
    <div className="space-y-3">

      {(images.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div key={`${img}-${idx}`} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 group">
              {isVideoPath(img) ? (
                thumbMap[img]
                  ? <img src={thumbMap[img]} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 gap-1">
                      <Video size={24} className="text-gray-400" />
                      <span className="text-[9px] text-gray-400 truncate px-1 w-full text-center">
                        {img.split('/').pop()}
                      </span>
                    </div>
              ) : (
                <img
                  src={getDisplayUrl(img)} alt=""
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />

              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-[#BA1932] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none pointer-events-none z-10">
                  MAIN
                </span>
              )}
              {idx !== 0 && (
                <button type="button" title="Set as main"
                  onClick={e => { e.stopPropagation(); setAsMain(idx) }}
                  className="absolute bottom-1.5 left-1.5 w-6 h-6 bg-white/90 text-amber-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow hover:bg-white hover:scale-110 active:scale-95">
                  <Star size={11} />
                </button>
              )}
              <button type="button" title="Remove"
                onClick={e => { e.stopPropagation(); removeImage(idx) }}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow hover:bg-red-600 hover:scale-110 active:scale-95">
                <X size={11} />
              </button>
            </div>
          ))}

          {uploading.map(u => (
            <div key={u.id} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 flex flex-col items-center justify-center gap-1.5 px-2">
              {u.stage?.startsWith('Adding') ? (
                <Droplets size={20} className="text-[#BA1932] animate-pulse" />
              ) : (
                <ProgressRing pct={u.pct} />
              )}
              <p className="text-[9px] text-gray-500 text-center leading-tight">{u.stage}</p>
              <p className="text-[8px] text-gray-400 truncate w-full text-center">{u.name}</p>
            </div>
          ))}
        </div>
      )}

      {errors.map((err, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <AlertCircle size={13} className="shrink-0" />
          {err}
        </div>
      ))}

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-6 cursor-pointer transition-all select-none ${
          dragging ? 'border-[#BA1932] bg-[#BA1932]/5' : 'border-gray-200 hover:border-[#BA1932]/60 hover:bg-gray-50'
        }`}
      >
        <Upload size={22} className={`mb-2 transition-colors ${dragging ? 'text-[#BA1932]' : 'text-gray-300'}`} />
        <p className="text-sm font-medium text-gray-500">
          {dragging ? 'Drop to upload' : `Drag & drop ${allowVideo ? 'images or videos' : 'images'} here`}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {allowVideo
            ? 'JPG, PNG, WEBP up to 20 MB · MP4, MOV, WEBM up to 100 MB'
            : 'JPG, PNG, WEBP up to 20 MB'}
        </p>
        {allowVideo && (
          <p className="text-[10px] text-[#BA1932]/70 mt-1 font-medium">
            Logo watermark will be applied to all video frames automatically
          </p>
        )}
        <input
          ref={inputRef} type="file" accept={acceptedTypes} multiple className="hidden"
          onChange={e => { handleFiles(e.target.files); e.target.value = '' }}
        />
      </div>

      <div className="flex gap-2">
        {showUrl ? (
          <div className="flex gap-2 flex-1">
            <input
              autoFocus type="url" value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); addUrl() }
                if (e.key === 'Escape') { setShowUrl(false); setUrlInput('') }
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 outline-none focus:border-[#BA1932] focus:ring-2 focus:ring-[#BA1932]/20 transition-all placeholder-gray-400"
            />
            <button type="button" onClick={addUrl}
              className="px-4 py-2 bg-[#730D26] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
              Add
            </button>
            <button type="button" onClick={() => { setShowUrl(false); setUrlInput('') }}
              className="px-3 py-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
              <X size={15} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setShowUrl(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 hover:text-[#730D26] border border-gray-200 rounded-xl hover:border-[#730D26]/30 transition-all">
            <Link size={13} />
            Add image URL
          </button>
        )}
      </div>

      {images.length > 0 && (
        <p className="text-xs text-gray-400">
          {images.length} file{images.length !== 1 ? 's' : ''} · hover a thumbnail to remove or
          <Star size={9} className="inline mx-0.5 text-amber-400 fill-amber-400" />
          set as main
        </p>
      )}
    </div>
  )
}