// Sagging-line math for the photo-room clothesline. lineY is high enough that
// a hanging card's name label clears the balcony railing.

export const CLOTHESLINE_DEFAULTS = { lineY: 3.05, sag: 0.5, halfSpan: 9 }

export function sagY(x, options = {}) {
  const { lineY, sag, halfSpan } = { ...CLOTHESLINE_DEFAULTS, ...options }
  return lineY - sag * (1 - (x / halfSpan) ** 2)
}

export function getLinePoints(options = {}) {
  const opts = { ...CLOTHESLINE_DEFAULTS, ...options }
  return Array.from({ length: 40 }, (_, i) => {
    const x = -opts.halfSpan + (i / 39) * opts.halfSpan * 2
    return [x, sagY(x, opts), 0]
  })
}

// Evenly spaces `count` items along the line and drops each one below it by
// `dropOffset`, so the returned positions are where a hanging card's center
// should sit.
export function getCardPositions(count, options = {}) {
  const opts = { ...CLOTHESLINE_DEFAULTS, ...options }
  const dropOffset = options.dropOffset ?? 0.75

  if (count <= 0) return []
  if (count === 1) {
    return [[0, sagY(0, opts) - dropOffset, 0.05]]
  }

  const spread = opts.halfSpan * 1.4
  return Array.from({ length: count }, (_, i) => {
    const x = -spread / 2 + (i / (count - 1)) * spread
    const clampedX = Math.max(-opts.halfSpan, Math.min(opts.halfSpan, x))
    return [x, sagY(clampedX, opts) - dropOffset, 0.05]
  })
}
