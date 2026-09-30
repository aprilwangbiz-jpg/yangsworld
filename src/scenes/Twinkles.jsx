import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { HOME } from '../three/homePalette'

// Four-point "sparkle" star, like the little glints in the reference art.
function makeStarGeometry() {
  const shape = new THREE.Shape()
  const outer = 1
  const inner = 0.22
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + Math.PI / 2
    const r = i % 2 === 0 ? outer : inner
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return new THREE.ShapeGeometry(shape)
}

const COLORS = [HOME.cream, HOME.yellow, HOME.sage]

// One shared shape for every star (there are a couple hundred of them).
let starGeometry = null
function getStarGeometry() {
  starGeometry ??= makeStarGeometry()
  return starGeometry
}

export function Star({ position, size = 0.12, color = HOME.cream, speed = 1.4 }) {
  const ref = useRef(null)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + phase
    const s = size * (0.65 + 0.35 * Math.sin(t))
    ref.current.scale.set(s, s, s)
    ref.current.lookAt(state.camera.position)
  })

  return (
    <mesh ref={ref} position={position} geometry={getStarGeometry()}>
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.9} />
    </mesh>
  )
}

// A scatter of twinkling stars filling the corridor volume.
export function TwinkleField({ count = 210, width = 9, height = 6.5, startZ = 10, endZ = -58 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * width,
          0.4 + Math.random() * (height - 0.4),
          startZ + Math.random() * (endZ - startZ),
        ],
        size: 0.05 + Math.random() * 0.1,
        color: COLORS[i % COLORS.length],
        speed: 0.8 + Math.random() * 1.6,
      })),
    [count, width, height, startZ, endZ]
  )

  return (
    <group>
      {stars.map((star, i) => (
        <Star key={i} {...star} />
      ))}
    </group>
  )
}
