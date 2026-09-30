import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Text, useTexture } from '@react-three/drei'

const INK = '#1a1a1a'
const PAPER = '#fefefe'
const ACCENT = '#d94f30'

const MAT_WIDTH = 1.2
const MAT_HEIGHT = 1.4
const MAX_PHOTO_WIDTH = 1.02
const MAX_PHOTO_HEIGHT = 1.02

function fitWithinBounds(aspect) {
  let width = MAX_PHOTO_WIDTH
  let height = width / aspect
  if (height > MAX_PHOTO_HEIGHT) {
    height = MAX_PHOTO_HEIGHT
    width = height * aspect
  }
  return [width, height]
}

export function PhotoCard3D({ photo, position, onInspect }) {
  const groupRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const texture = useTexture(photo.url)
  const aspect = texture.image ? texture.image.width / texture.image.height : 1
  const [photoWidth, photoHeight] = fitWithinBounds(aspect)

  useFrame((state) => {
    if (!groupRef.current) return
    const sway = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.025
    groupRef.current.rotation.z = sway
    const targetScale = hovered ? 1.06 : 1
    groupRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.15)
  })

  return (
    <group position={position}>
      {/* clothespin */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.1, 0.16, 0.06]} />
        <meshStandardMaterial color="#c9a15a" />
        <Edges color={INK} threshold={1} />
      </mesh>

      <group
        ref={groupRef}
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
          onInspect(photo)
        }}
      >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[MAT_WIDTH, MAT_HEIGHT, 0.04]} />
          <meshStandardMaterial color={hovered ? '#fff4ee' : PAPER} />
          <Edges color={hovered ? ACCENT : INK} threshold={1} />
        </mesh>

        <mesh position={[0, 0.06, 0.03]}>
          <planeGeometry args={[photoWidth, photoHeight]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        {photo.caption && (
          <Text
            position={[0, -0.58, 0.03]}
            fontSize={0.085}
            maxWidth={MAT_WIDTH - 0.1}
            color={INK}
            anchorX="center"
            anchorY="middle"
          >
            {photo.caption}
          </Text>
        )}
      </group>
    </group>
  )
}
