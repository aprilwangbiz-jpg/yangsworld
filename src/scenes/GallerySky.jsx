import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { createSkylineTexture, createCloudTexture } from '../three/textures'

const CLOUD_LAYOUT = [
  { position: [-6, 5.5, -14], scale: 3.2, speed: 0.02 },
  { position: [4, 6.5, -16], scale: 4, speed: 0.015 },
  { position: [-2, 7.5, -18], scale: 2.6, speed: 0.025 },
  { position: [8, 5, -12], scale: 2.2, speed: 0.03 },
  { position: [-9, 6.8, -20], scale: 3.6, speed: 0.018 },
]

function Cloud({ texture, position, scale, speed }) {
  const ref = useRef(null)
  const startX = position[0]
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.x = startX + Math.sin(state.clock.elapsedTime * speed) * 1.5
  })
  return (
    <Billboard position={position} ref={ref}>
      <mesh scale={scale}>
        <planeGeometry args={[1, 0.6]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} />
      </mesh>
    </Billboard>
  )
}

export function GallerySky() {
  const skylineTexture = useMemo(() => createSkylineTexture(), [])
  const cloudTexture = useMemo(() => createCloudTexture(), [])

  return (
    <group>
      <mesh position={[0, 2, -10]}>
        <planeGeometry args={[36, 6]} />
        <meshBasicMaterial map={skylineTexture} transparent />
      </mesh>

      {CLOUD_LAYOUT.map((cloud, i) => (
        <Cloud key={i} texture={cloudTexture} {...cloud} />
      ))}
    </group>
  )
}
