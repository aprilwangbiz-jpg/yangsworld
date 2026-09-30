import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

const BASE_POSITION = { x: 0, y: 1.45, z: 5.5 }

export function GalleryCamera() {
  const { camera, pointer } = useThree()
  const smoothed = useRef({ x: 0, y: 0 })

  useFrame(() => {
    smoothed.current.x += (pointer.x * 1.6 - smoothed.current.x) * 0.05
    smoothed.current.y += (pointer.y * 0.4 - smoothed.current.y) * 0.05

    camera.position.set(
      BASE_POSITION.x + smoothed.current.x,
      BASE_POSITION.y + smoothed.current.y,
      BASE_POSITION.z
    )
    camera.lookAt(smoothed.current.x * 0.6, 1.3, -4)
  })

  return null
}
