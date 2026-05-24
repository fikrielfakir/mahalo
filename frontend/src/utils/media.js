export const VIDEO_EXTS = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v']

const API_BASE = import.meta.env.VITE_API_URL || ''

export function isVideoPath(p = '') {
  if (!p) return false
  const ext = p.split('?')[0].split('.').pop().toLowerCase()
  return VIDEO_EXTS.includes(ext)
}

export function mediaUrl(path) {
  if (!path) return ''
  if (path.startsWith('blob:')) return path
  // Strip any origin from storage URLs so requests route through the Vite proxy
  // e.g. https://api.mahalo.ma/storage/logos/x.jpg → /storage/logos/x.jpg
  if (path.includes('/storage/')) {
    const rel = '/storage/' + path.split('/storage/').slice(1).join('/storage/')
    return `${API_BASE}${rel}`
  }
  if (path.startsWith('http')) return path
  if (isVideoPath(path)) return `${API_BASE}/api/v1/stream/${path}`
  return `${API_BASE}/storage/${path}`
}
