import { useState } from 'react'
import { Text } from '@react-three/drei'
import { HOME } from '../three/homePalette'
import { LeafDoor, leafDoorHeight } from './LeafDoor'

const DOOR_W = 1.7
const DOOR_H = leafDoorHeight(DOOR_W)
const OPEN_ANGLE = (100 * Math.PI) / 180
const PEEK_ANGLE = (10 * Math.PI) / 180

// A side-wall room door: the leaf door with its name in yellow letters above. Hovering opens
// it a crack; clicking swings it open onto the glow and enters the room.
export function Door({ label, position = [0, 0, 0], rotation = [0, 0, 0], onEnter }) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <group position={position} rotation={rotation}>
      <Text
        position={[0, DOOR_H + 0.35, 0.05]}
        fontSize={0.3}
        letterSpacing={0.06}
        anchorX="center"
        anchorY="middle"
      >
        {label}
        {/* skip tone mapping + fog so the letters show the exact swatch yellow */}
        <meshBasicMaterial attach="material" color={HOME.signYellow} toneMapped={false} fog={false} />
      </Text>

      <LeafDoor
        width={DOOR_W}
        getAngle={() => (open ? OPEN_ANGLE : hovered ? PEEK_ANGLE : 0)}
        showSeam={!open && !hovered}
        frameWidth={hovered ? 5.5 : 4}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
          onEnter?.()
        }}
      />
    </group>
  )
}
