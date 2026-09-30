import { useMemo } from 'react'
import { createHatchTexture, createPlankTexture } from '../three/textures'
import { HOME } from '../three/homePalette'

// The tunnel envelops the camera's full scroll travel (see CameraRig's
// START_Z/END_Z) so the walls are already surrounding the camera at rest,
// instead of the camera looking at a distant doorway from outside it.
const CORRIDOR_START_Z = 12
const CORRIDOR_END_Z = -60
const CORRIDOR_LENGTH = CORRIDOR_START_Z - CORRIDOR_END_Z
const CORRIDOR_CENTER_Z = (CORRIDOR_START_Z + CORRIDOR_END_Z) / 2
const CORRIDOR_WIDTH = 10
const CORRIDOR_HEIGHT = 7

const SKYLIGHT_WIDTH = 4.2
const SKYLIGHT_DEPTH = 2.6
const MULLION = 0.03

// A ceiling window: glowing cream glass in a navy frame, split into four panes.
function Skylight({ z }) {
  const y = CORRIDOR_HEIGHT - 0.02
  return (
    <group position={[0, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SKYLIGHT_WIDTH, SKYLIGHT_DEPTH]} />
        <meshBasicMaterial color={HOME.cream} toneMapped={false} />
      </mesh>
      {/* outer frame + center cross */}
      {[
        [0, -SKYLIGHT_DEPTH / 2, SKYLIGHT_WIDTH + MULLION, MULLION],
        [0, SKYLIGHT_DEPTH / 2, SKYLIGHT_WIDTH + MULLION, MULLION],
        [0, 0, SKYLIGHT_WIDTH, MULLION],
        [-SKYLIGHT_WIDTH / 2, 0, MULLION, SKYLIGHT_DEPTH],
        [SKYLIGHT_WIDTH / 2, 0, MULLION, SKYLIGHT_DEPTH],
        [0, 0, MULLION, SKYLIGHT_DEPTH],
      ].map(([x, dz, w, d], i) => (
        <mesh key={i} position={[x, -0.015, dz]}>
          <boxGeometry args={[w, 0.03, d]} />
          <meshBasicMaterial color={HOME.ink} />
        </mesh>
      ))}
    </group>
  )
}

export function CorridorEnvironment() {
  const floorTexture = useMemo(
    () =>
      createPlankTexture({
        bg: HOME.floor,
        tone: HOME.stroke,
        highlight: HOME.ceiling,
        repeatX: 2,
        repeatY: CORRIDOR_LENGTH / 2,
      }),
    []
  )
  const wallTexture = useMemo(
    () =>
      createHatchTexture({
        bg: HOME.wall,
        tone: HOME.stroke,
        highlight: '#7fa8e6',
        lines: 160,
        repeatX: 3,
        repeatY: CORRIDOR_LENGTH / 3,
      }),
    []
  )
  const ceilingTexture = useMemo(
    () =>
      createHatchTexture({
        bg: HOME.ceiling,
        tone: HOME.stroke,
        highlight: '#8fb4ea',
        lines: 110,
        repeatX: 3,
        repeatY: CORRIDOR_LENGTH / 3,
      }),
    []
  )

  return (
    <group>
      {/* floor — unlit so the surfaces read as flat colored-pencil art at exact palette colors */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CORRIDOR_CENTER_Z]} receiveShadow>
        <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_LENGTH]} />
        <meshBasicMaterial map={floorTexture} />
      </mesh>

      {/* ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, CORRIDOR_HEIGHT, CORRIDOR_CENTER_Z]}
      >
        <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_LENGTH]} />
        <meshBasicMaterial map={ceilingTexture} />
      </mesh>

      {/* left wall */}
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[-CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, CORRIDOR_CENTER_Z]}
      >
        <planeGeometry args={[CORRIDOR_LENGTH, CORRIDOR_HEIGHT]} />
        <meshBasicMaterial map={wallTexture} />
      </mesh>

      {/* right wall */}
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={[CORRIDOR_WIDTH / 2, CORRIDOR_HEIGHT / 2, CORRIDOR_CENTER_Z]}
      >
        <planeGeometry args={[CORRIDOR_LENGTH, CORRIDOR_HEIGHT]} />
        <meshBasicMaterial map={wallTexture} />
      </mesh>

      {/* big glowing skylight windows every ~6 units down the hallway */}
      {Array.from({ length: Math.floor(CORRIDOR_LENGTH / 6) }, (_, i) => (
        <Skylight key={i} z={CORRIDOR_START_Z - 3 - i * 6} />
      ))}

      <ambientLight intensity={1.05} />
      <directionalLight position={[2, 6, 4]} intensity={0.45} color={HOME.cream} />
    </group>
  )
}

export {
  CORRIDOR_LENGTH,
  CORRIDOR_WIDTH,
  CORRIDOR_HEIGHT,
  CORRIDOR_START_Z,
  CORRIDOR_END_Z,
}
