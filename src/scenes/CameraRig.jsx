import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'

const START_Z = 9
const END_Z = -56
const EYE_HEIGHT = 1.55

export function CameraRig() {
  const scroll = useScroll()
  const { camera, pointer } = useThree()
  const targetPos = useRef({ x: 0, z: START_Z })

  useFrame(() => {
    const progress = scroll.offset
    const z = START_Z + (END_Z - START_Z) * progress
    const parallaxX = pointer.x * 0.4
    const bob = Math.sin(progress * Math.PI * 10) * 0.03

    targetPos.current.x += (parallaxX - targetPos.current.x) * 0.06
    targetPos.current.z += (z - targetPos.current.z) * 0.15

    camera.position.set(targetPos.current.x, EYE_HEIGHT + bob, targetPos.current.z)
    camera.lookAt(targetPos.current.x * 0.5, EYE_HEIGHT, targetPos.current.z - 6)
  })

  return null
}

export { START_Z, END_Z }
