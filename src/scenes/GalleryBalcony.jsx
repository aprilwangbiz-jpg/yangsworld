import { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import { createHerringboneTexture } from '../three/textures'

const INK = '#1a1a1a'
const WOOD = '#f1e4c9'
const RAIL_WIDTH = 22
const BALUSTER_COUNT = 26
const RAIL_Z = 1.2
const RAIL_TOP_Y = 0.95
const RAIL_BOTTOM_Y = 0.15

export function GalleryBalcony() {
  const floorTexture = useMemo(() => createHerringboneTexture(), [])

  const balusters = useMemo(
    () =>
      Array.from({ length: BALUSTER_COUNT }, (_, i) => {
        const t = i / (BALUSTER_COUNT - 1)
        return (t - 0.5) * RAIL_WIDTH
      }),
    []
  )

  return (
    <group>
      {/* floor: near edge sits just past the camera, receding toward the skyline
          so there's a visible ground gap in front of the rail instead of the
          rail looking like it's resting directly on a tabletop */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]}>
        <planeGeometry args={[RAIL_WIDTH, 12]} />
        <meshStandardMaterial map={floorTexture} roughness={1} />
      </mesh>

      {/* rails, at roughly waist height for a standing viewer */}
      <mesh position={[0, RAIL_TOP_Y, RAIL_Z]}>
        <boxGeometry args={[RAIL_WIDTH, 0.12, 0.12]} />
        <meshStandardMaterial color={WOOD} />
        <Edges color={INK} threshold={1} />
      </mesh>
      <mesh position={[0, RAIL_BOTTOM_Y, RAIL_Z]}>
        <boxGeometry args={[RAIL_WIDTH, 0.12, 0.12]} />
        <meshStandardMaterial color={WOOD} />
        <Edges color={INK} threshold={1} />
      </mesh>

      {balusters.map((x, i) => (
        <mesh key={i} position={[x, (RAIL_TOP_Y + RAIL_BOTTOM_Y) / 2, RAIL_Z]}>
          <cylinderGeometry args={[0.05, 0.05, RAIL_TOP_Y - RAIL_BOTTOM_Y, 8]} />
          <meshStandardMaterial color={WOOD} flatShading />
          <Edges color={INK} threshold={20} />
        </mesh>
      ))}

      <ambientLight intensity={1} />
      <directionalLight position={[3, 6, 4]} intensity={0.35} />
    </group>
  )
}
