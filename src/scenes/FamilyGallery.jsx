import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GallerySky } from './GallerySky'
import { GalleryBalcony } from './GalleryBalcony'
import { PhotoClothesline } from './PhotoClothesline'
import { GalleryCamera } from './GalleryCamera'

export function FamilyGallery({ photos, onInspect }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      camera={{ fov: 55, position: [0, 1.45, 5.5] }}
    >
      <color attach="background" args={['#f3f3f3']} />
      <fog attach="fog" args={['#f3f3f3', 14, 26]} />
      <Suspense fallback={null}>
        <GalleryCamera />
        <GallerySky />
        <GalleryBalcony />
        <PhotoClothesline photos={photos} onInspect={onInspect} />
      </Suspense>
    </Canvas>
  )
}
