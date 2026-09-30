import * as THREE from 'three'

// Procedurally draws a pencil-hatch pattern onto a canvas and returns it as a
// repeating THREE.CanvasTexture. Fully original/generated — no external art.
// `highlight` adds a second pass of lighter strokes for a colored-pencil feel.
function makeHatchCanvas({ lines = 140, tone = '#1a1a1a', bg = '#fafafa', highlight, size = 512 }) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = tone
  ctx.globalAlpha = 0.16
  ctx.lineWidth = 1

  for (let i = 0; i < lines; i++) {
    const x = Math.random() * size
    const wobble = (Math.random() - 0.5) * 30
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + wobble, size)
    ctx.stroke()
  }

  if (highlight) {
    ctx.strokeStyle = highlight
    ctx.globalAlpha = 0.12
    for (let i = 0; i < lines / 2; i++) {
      const x = Math.random() * size
      const wobble = (Math.random() - 0.5) * 30
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + wobble, size)
      ctx.stroke()
    }
  }

  // faint paper grain speckle
  ctx.globalAlpha = 0.05
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? tone : bg
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1)
  }

  return canvas
}

export function createHatchTexture(options = {}) {
  const canvas = makeHatchCanvas(options)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(options.repeatX ?? 4, options.repeatY ?? 4)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Wood-plank floor: hatch base plus a few long horizontal seams per repeat tile.
export function createPlankTexture(options = {}) {
  const size = options.size ?? 512
  const canvas = makeHatchCanvas({ ...options, lines: options.lines ?? 60, size })
  const ctx = canvas.getContext('2d')

  ctx.strokeStyle = options.tone ?? '#1a1a1a'
  ctx.globalAlpha = 0.35
  ctx.lineWidth = 2
  const plankHeight = size / 4
  for (let y = plankHeight; y < size; y += plankHeight) {
    ctx.beginPath()
    ctx.moveTo(0, y + (Math.random() - 0.5) * 6)
    ctx.lineTo(size, y + (Math.random() - 0.5) * 6)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(options.repeatX ?? 2, options.repeatY ?? 10)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// A hand-drawn city skyline silhouette (varied building heights, a couple of
// water towers and a crane) for a background plane. Transparent outside the
// building shapes so the sky color shows through above the roofline.
export function createSkylineTexture({ width = 2048, height = 512 } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, width, height)

  ctx.strokeStyle = '#1a1a1a'
  ctx.fillStyle = '#e7e7e7'
  ctx.lineWidth = 2

  let x = 0
  while (x < width) {
    const w = 60 + Math.random() * 90
    const h = 120 + Math.random() * 260
    const y = height - h
    ctx.fillRect(x, y, w, h)
    ctx.strokeRect(x, y, w, h)

    // a few window dots
    ctx.globalAlpha = 0.4
    for (let wy = y + 16; wy < height - 16; wy += 22) {
      for (let wx = x + 10; wx < x + w - 10; wx += 18) {
        if (Math.random() > 0.5) ctx.fillRect(wx, wy, 6, 8)
      }
    }
    ctx.globalAlpha = 1

    // occasional rooftop antenna
    if (Math.random() > 0.7) {
      ctx.beginPath()
      ctx.moveTo(x + w * 0.5, y)
      ctx.lineTo(x + w * 0.5, y - 40)
      ctx.stroke()
    }

    x += w + (10 + Math.random() * 20)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// A soft, hand-drawn cloud blob (overlapping circles with an outline) on a
// transparent background, meant for a billboarded plane.
export function createCloudTexture({ size = 256 } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size * 0.6
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const bumps = [
    { x: 0.3, y: 0.6, r: 0.24 },
    { x: 0.5, y: 0.45, r: 0.3 },
    { x: 0.7, y: 0.58, r: 0.22 },
    { x: 0.42, y: 0.65, r: 0.2 },
    { x: 0.6, y: 0.65, r: 0.2 },
  ]

  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = 3

  ctx.beginPath()
  bumps.forEach(({ x, y, r }) => {
    ctx.moveTo((x + r) * canvas.width, y * canvas.height)
    ctx.arc(x * canvas.width, y * canvas.height, r * canvas.width, 0, Math.PI * 2)
  })
  ctx.fill()
  bumps.forEach(({ x, y, r }) => {
    ctx.beginPath()
    ctx.arc(x * canvas.width, y * canvas.height, r * canvas.width, 0, Math.PI * 2)
    ctx.stroke()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Herringbone floor pattern for the gallery balcony.
export function createHerringboneTexture({ size = 256, tone = '#1a1a1a', bg = '#f1f1f1' } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = tone
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1.5

  const tile = size / 8
  for (let row = -1; row < 9; row++) {
    for (let col = -1; col < 9; col++) {
      const x = col * tile
      const y = row * tile
      const flip = (row + col) % 2 === 0
      ctx.save()
      ctx.translate(x + tile / 2, y + tile / 2)
      ctx.rotate(flip ? Math.PI / 4 : -Math.PI / 4)
      ctx.strokeRect(-tile * 0.4, -tile * 0.15, tile * 0.8, tile * 0.3)
      ctx.restore()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(6, 6)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
