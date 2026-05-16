import { useEffect, useState, useRef, useCallback } from 'react'
import { adminMedia } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import { Upload, Trash2, Copy, Image, Check, X, RefreshCw, Video, Wand2, Loader2 } from 'lucide-react'
import { isVideoPath } from '../../utils/media'

function bytesToSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaPage() {
  const [files, setFiles]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [uploading, setUploading]     = useState(false)
  const [copiedId, setCopiedId]       = useState(null)
  const [selected, setSelected]       = useState(null)
  const [error, setError]             = useState(null)
  const [dragOver, setDragOver]       = useState(false)
  const [thumbLoading, setThumbLoading]   = useState(null)
  const [thumbError, setThumbError]       = useState(null)
  const [batchLoading, setBatchLoading]   = useState(false)
  const [batchResult, setBatchResult]     = useState(null)
  const inputRef = useRef()

  const load = useCallback(() => {
    setLoading(true)
    adminMedia.list({ per_page: 60 })
      .then((r) => {
        setFiles(Array.isArray(r?.data) ? r.data : [])
        setError(null)
      })
      .catch(() => {
        setError('Media library API not available on this backend yet.')
        setFiles([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleFiles = async (fileList) => {
    const allowed = [...fileList].filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    )
    if (!allowed.length) return
    setUploading(true)
    try {
      for (const file of allowed) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('collection', 'media')
        await adminMedia.upload(fd)
      }
      load()
    } catch (err) {
      alert('Upload failed — ' + (err?.message || 'unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.name || item.file_name}"?`)) return
    await adminMedia.delete(item.id)
    if (selected?.id === item.id) setSelected(null)
    load()
  }

  const copy = async (url, id) => {
    await navigator.clipboard.writeText(url).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const generateThumbnail = async (item) => {
    setThumbLoading(item.id)
    setThumbError(null)
    try {
      const blob = await captureVideoThumbnailFromUrl(item.url || item.original_url)
      if (!blob) throw new Error('Could not capture frame from video')
      const fd = new FormData()
      fd.append('thumbnail', blob, 'thumb.jpg')
      const res = await adminMedia.rethumbnail(item.id, fd)
      const newThumb = res.data?.thumbnail_url || res.thumbnail_url
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, thumbnail_url: newThumb } : f))
      if (selected?.id === item.id) {
        setSelected(prev => ({ ...prev, thumbnail_url: newThumb }))
      }
    } catch (err) {
      setThumbError(err?.message || 'Thumbnail generation failed')
    } finally {
      setThumbLoading(null)
    }
  }

  function captureVideoThumbnailFromUrl(url) {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true
      video.crossOrigin = 'anonymous'
      video.src = url

      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration * 0.1 || 0)
      }

      video.onseeked = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = Math.round((640 / video.videoWidth) * video.videoHeight) || 360
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          video.remove()
          resolve(blob)
        }, 'image/jpeg', 0.85)
      }

      video.onerror = () => { video.remove(); resolve(null) }
    })
  }

  const generateAllThumbnails = async () => {
    setBatchLoading(true)
    setBatchResult(null)
    setThumbError(null)
    try {
      const res = await adminMedia.batchRethumbnail()
      setBatchResult(res.message || `Done: ${res.done} generated`)
      load()
    } catch (err) {
      setThumbError(err?.message || 'Batch thumbnail generation failed')
    } finally {
      setBatchLoading(false)
    }
  }

  const getUrl = (item) => item.original_url || item.url || `/storage/${item.file_name}`

  return (
    <div>
      <PageHeader title="Media Library" subtitle={`${files.length} files`}>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={load}><RefreshCw size={14} /> Refresh</Btn>
          <Btn variant="ghost" onClick={generateAllThumbnails} disabled={batchLoading} title="Generate thumbnails for all videos that are missing one">
            {batchLoading ? <><Loader2 size={14} className="animate-spin" /> Processing…</> : <><Wand2 size={14} /> Re-thumbnail All</>}
          </Btn>
          <Btn variant="gold" onClick={() => inputRef.current?.click()} disabled={uploading}>
            <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
          </Btn>
        </div>
        <input ref={inputRef} type="file" accept="image/*,video/mp4,video/quicktime,video/webm,video/x-msvideo" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </PageHeader>

      {error && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <strong>Note:</strong> {error}
        </div>
      )}

      {batchResult && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm flex items-center justify-between">
          <span><strong>Done:</strong> {batchResult}</span>
          <button onClick={() => setBatchResult(null)}><X size={14} /></button>
        </div>
      )}

      {thumbError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center justify-between">
          <span><strong>Thumbnail error:</strong> {thumbError}</span>
          <button onClick={() => setThumbError(null)}><X size={14} /></button>
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`mb-6 border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver ? 'border-[#BA1932] bg-[#BA1932]/5' : 'border-gray-200 hover:border-[#BA1932]/50'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={28} className={`mx-auto mb-3 ${dragOver ? 'text-[#BA1932]' : 'text-gray-300'}`} />
        <p className="text-gray-500 text-sm font-medium">Drop images or videos here or click to browse</p>
        <p className="text-gray-400 text-xs mt-1">PNG, JPG, WebP · MP4, MOV, WebM</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        !error && (
          <div className="text-center py-20 text-gray-400">
            <Image size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No media uploaded yet</p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {files.map((item) => {
            const url = getUrl(item)
            const isVid = isVideoPath(item.path || item.file_name || '')
            const thumbUrl = item.thumbnail_url || (isVid ? null : url)
            const isGenerating = thumbLoading === item.id
            return (
              <div
                key={item.id}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
                className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selected?.id === item.id ? 'border-[#BA1932] ring-2 ring-[#BA1932]/30' : 'border-transparent hover:border-gray-200'}`}
              >
                {isVid ? (
                  thumbUrl
                    ? <img src={thumbUrl} alt={item.file_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center gap-1">
                        <Video size={24} className="text-gray-400" />
                        <span className="text-[9px] text-gray-400 truncate px-1 w-full text-center">{item.file_name}</span>
                      </div>
                ) : (
                  <img src={url} alt={item.name || item.file_name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />

                {/* Generate thumbnail button for videos missing thumbnail */}
                {isVid && !thumbUrl && (
                  <button
                    onClick={(e) => { e.stopPropagation(); generateThumbnail(item) }}
                    disabled={isGenerating}
                    title="Generate thumbnail"
                    className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-lg bg-[#BA1932] text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                  </button>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); remove(item) }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X size={11} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Selected file detail panel */}
      {selected && (() => {
        const selIsVid = isVideoPath(selected.path || selected.file_name || '')
        const selThumb = selected.thumbnail_url
        const selUrl   = getUrl(selected)
        return (
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl border-l border-gray-100 z-40 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">File Details</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50">
                {selIsVid ? (
                  selThumb
                    ? <img src={selThumb} alt={selected.file_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center gap-2">
                        <Video size={32} className="text-gray-400" />
                        <span className="text-xs text-gray-400">No thumbnail</span>
                      </div>
                ) : (
                  <img src={selUrl} alt={selected.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">File name</p>
                <p className="text-sm text-gray-800 break-all">{selected.file_name || selected.name}</p>
              </div>
              {selected.size && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Size</p>
                  <p className="text-sm text-gray-800">{bytesToSize(selected.size)}</p>
                </div>
              )}
              {selIsVid && selThumb && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Thumbnail URL</p>
                  <p className="text-xs text-gray-600 break-all bg-gray-50 rounded-lg p-2">{selThumb}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">URL</p>
                <p className="text-xs text-gray-600 break-all bg-gray-50 rounded-lg p-2">{selUrl}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 space-y-2">
              {selIsVid && !selThumb && (
                <Btn
                  variant="ghost"
                  className="w-full justify-center"
                  disabled={thumbLoading === selected.id}
                  onClick={() => generateThumbnail(selected)}
                >
                  {thumbLoading === selected.id
                    ? <><Loader2 size={14} className="animate-spin" /> Generating…</>
                    : <><Wand2 size={14} /> Generate Thumbnail</>
                  }
                </Btn>
              )}
              <Btn variant="gold" className="w-full justify-center" onClick={() => copy(selUrl, selected.id)}>
                {copiedId === selected.id ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy URL</>}
              </Btn>
              <Btn variant="danger" className="w-full justify-center" onClick={() => remove(selected)}>
                <Trash2 size={14} /> Delete
              </Btn>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
