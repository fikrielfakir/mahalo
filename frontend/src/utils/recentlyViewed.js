const KEY = 'mahalo_recently_viewed'
const VIDEO_RE = /\.(mp4|mov|avi|mkv|webm|m4v)$/i

export function pickBestImage(property) {
  const images = Array.isArray(property.images) ? property.images : []
  const firstImg = images.find(img => !VIDEO_RE.test(img))
  if (firstImg) return firstImg
  const firstVideo = images.find(img => VIDEO_RE.test(img))
  if (firstVideo && property.video_thumbnails?.[firstVideo]) {
    return property.video_thumbnails[firstVideo]
  }
  return property.thumbnail_url || null
}

export function trackRecentlyViewed(property) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY)) || []
    const filtered = existing.filter(p => p.id !== property.id)
    const entry = {
      id:              property.id,
      slug:            property.slug || property.id,
      name:            property.name,
      price:           property.price,
      type:            property.type,
      image:           pickBestImage(property),
      city:            property.city?.name,
      number_bedroom:  property.number_bedroom,
      number_bathroom: property.number_bathroom,
      square:          property.square,
    }
    localStorage.setItem(KEY, JSON.stringify([entry, ...filtered].slice(0, 6)))
  } catch {}
}

export { KEY as RECENTLY_VIEWED_KEY }
