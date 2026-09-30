const MAX_SIDE = 2000
const QUALITY = 0.85

// Shrinks a photo to at most 2000px on its long side and re-encodes it as
// WebP before upload, so phone photos (often 5–10 MB) fit the free storage
// tier. GIFs are passed through untouched to keep any animation.
// Returns { blob, extension, contentType }.
export async function resizeImage(file) {
  if (file.type === 'image/gif') {
    return { blob: file, extension: 'gif', contentType: file.type }
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  // Older Safari can't encode WebP and silently returns PNG — use JPEG there.
  const webp = await encode(canvas, 'image/webp')
  if (webp.type === 'image/webp') {
    return { blob: webp, extension: 'webp', contentType: 'image/webp' }
  }
  const jpeg = await encode(canvas, 'image/jpeg')
  return { blob: jpeg, extension: 'jpg', contentType: 'image/jpeg' }
}

function encode(canvas, type) {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('could not encode image'))), type, QUALITY)
  )
}
