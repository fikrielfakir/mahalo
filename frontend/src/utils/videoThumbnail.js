export function captureVideoThumbnail(file, seekTo = 1.0) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const url = URL.createObjectURL(file)
    video.src = url

    video.onloadeddata = () => {
      video.currentTime = Math.min(seekTo, video.duration * 0.1 || 0)
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = Math.round((640 / video.videoWidth) * video.videoHeight) || 360

      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        resolve(blob)
      }, 'image/jpeg', 0.85)
    }

    video.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
  })
}
