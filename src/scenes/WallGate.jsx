import { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { CORRIDOR_WIDTH, CORRIDOR_HEIGHT } from './CorridorEnvironment'
import { createHatchTexture } from '../three/textures'
import { HOME } from '../three/homePalette'
import { LeafDoor, leafDoorHeight, leafDoorOutline } from './LeafDoor'

const DOOR_WIDTH = 3.2
const DOOR_HEIGHT = leafDoorHeight(DOOR_WIDTH) // ≈ 5.87
const OPEN_ANGLE = Math.PI / 2
const OPEN_RANGE = 5
// Outer wall edge dips below the floor so the doorway hole never shares an
// edge with the outline (keeps triangulation clean).
const WALL_BOTTOM = -0.2

const NUMERALS = ['I', 'II', 'III', 'IV', 'V']

// A blue colored-pencil wall across the corridor (same look as the side
// walls) with a big leaf-shaped doorway. The leaf door swings away from the
// camera as it approaches, and closes again if you scroll back.
export function WallGate({ position = [0, 0, 0], index = 0 }) {
  const { camera } = useThree()
  const doorZ = position[2]

  const wall = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-CORRIDOR_WIDTH / 2, WALL_BOTTOM)
    shape.lineTo(CORRIDOR_WIDTH / 2, WALL_BOTTOM)
    shape.lineTo(CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT)
    shape.lineTo(-CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT)
    shape.closePath()
    shape.holes.push(leafDoorOutline(DOOR_WIDTH, THREE.Path))

    const texture = createHatchTexture({
      bg: HOME.wall,
      tone: HOME.stroke,
      highlight: '#7fa8e6',
      lines: 220,
      // UVs are in world units: one tile ≈ 7 units, so the wall shows almost no seams.
      repeatX: 1 / 7,
      repeatY: 1 / 7,
    })
    return { geometry: new THREE.ShapeGeometry(shape, 24), texture }
  }, [])

  function getAngle() {
    const approachDistance = camera.position.z - doorZ
    const openAmount = Math.min(1, Math.max(0, 1 - approachDistance / OPEN_RANGE))
    return -openAmount * OPEN_ANGLE // negative = swing away from the camera
  }

  return (
    <group position={position}>
      <mesh geometry={wall.geometry}>
        <meshBasicMaterial map={wall.texture} side={THREE.DoubleSide} />
      </mesh>

      <LeafDoor width={DOOR_WIDTH} getAngle={getAngle} glow={false} showSeam={false} frameWidth={5} />

      {/* roman-numeral placard above the arch */}
      <Text
        position={[0, DOOR_HEIGHT + 0.45, 0.03]}
        fontSize={0.36}
        color={HOME.cream}
        outlineWidth={0.012}
        outlineColor={HOME.ink}
        anchorX="center"
        anchorY="middle"
      >
        {NUMERALS[index] ?? String(index + 1)}
      </Text>
    </group>
  )
}
