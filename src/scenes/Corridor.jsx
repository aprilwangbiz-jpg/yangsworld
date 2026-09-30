import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { CorridorEnvironment, CORRIDOR_WIDTH } from './CorridorEnvironment'
import { EntryLogo } from './EntryLogo'
import { Doodles } from './Doodles'
import { Door } from './Door'
import { WallGate } from './WallGate'
import { CameraRig } from './CameraRig'
import { TwinkleField } from './Twinkles'
import { HOME } from '../three/homePalette'
import { ROOMS } from '../data/rooms'

const LEFT_WALL = { x: -CORRIDOR_WIDTH / 2 + 0.06, rotationY: Math.PI / 2 }
const RIGHT_WALL = { x: CORRIDOR_WIDTH / 2 - 0.06, rotationY: -Math.PI / 2 }

// Where each room's door hangs; ids match src/data/rooms.js.
const DOOR_PLACEMENTS = {
  garden: { wall: LEFT_WALL, z: -2 },
  about: { wall: RIGHT_WALL, z: -8 },
  family: { wall: LEFT_WALL, z: -11 },
  portfolio: { wall: RIGHT_WALL, z: -15 },
  travel: { wall: LEFT_WALL, z: -18 },
  friends: { wall: RIGHT_WALL, z: -21 },
}

// Five sequential stone-wall doorways standing across the hallway itself,
// spaced deeper than the six click-to-enter side doors. Each door opens on
// proximity as the camera reaches it — see WallGate.jsx.
const GATE_POSITIONS = [-24, -31, -38, -45, -52]

// Every side door opens a photo room.
export function Corridor({ onEnterRoom }) {
  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      camera={{ fov: 55, position: [0, 1.55, 9] }}
    >
      <color attach="background" args={[HOME.sky]} />
      <fog attach="fog" args={[HOME.sky, 16, 55]} />
      <Suspense fallback={null}>
        <ScrollControls pages={6} damping={0.2}>
          <CameraRig />
          <CorridorEnvironment />
          <TwinkleField />
          <EntryLogo position={[0, 0, -6]} />
          <Doodles originZ={-6} />
          {ROOMS.map((room) => {
            const { wall, z } = DOOR_PLACEMENTS[room.id]
            return (
              <Door
                key={room.id}
                label={room.label}
                position={[wall.x, 0, z]}
                rotation={[0, wall.rotationY, 0]}
                onEnter={() => onEnterRoom(room.id)}
              />
            )
          })}
          {GATE_POSITIONS.map((z, i) => (
            <WallGate key={z} position={[0, 0, z]} index={i} />
          ))}
        </ScrollControls>
      </Suspense>
    </Canvas>
  )
}
