import { Suspense } from 'react'
import { useTexture } from '@react-three/drei'

// Transparent cutout of the lady in the sun hat.
const PICTURE_URL = `${import.meta.env.BASE_URL}images/lady.webp`
const PICTURE_HEIGHT = 1.9
const PICTURE_LIFT = 0.5

function CutoutPicture({ height }) {
  const texture = useTexture(PICTURE_URL)
  const aspect = texture.image ? texture.image.width / texture.image.height : 3 / 4

  return (
    <mesh>
      <planeGeometry args={[height * aspect, height]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.02} toneMapped={false} />
    </mesh>
  )
}

// Replaces the old line-art avatar as the focal point of the entry scene.
export function EntryPicture(props) {
  return (
    <group {...props}>
      <Suspense fallback={null}>
        <group position={[0, PICTURE_HEIGHT / 2 + PICTURE_LIFT, 0]}>
          <CutoutPicture height={PICTURE_HEIGHT} />
        </group>
      </Suspense>
    </group>
  )
}
