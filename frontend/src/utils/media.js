export const VIDEO_EXTS = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v']

export function isVideoPath(p = '') {
  if (!p) return false
  const ext = p.split('?')[0].split('.').pop().toLowerCase()
  return VIDEO_EXTS.includes(ext)
}

export function mediaUrl(path) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('blob:')) return path
  if (isVideoPath(path)) return `/api/v1/stream/${path}`
  return `/storage/${path}`
}
