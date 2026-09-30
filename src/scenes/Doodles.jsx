import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import { HOME } from '../three/homePalette'
import { Star } from './Twinkles'

const INK = HOME.ink
const PAPER = HOME.cream

function Bob({ children, speed = 1, amplitude = 0.15, ...props }) {
  const ref = useRef(null)
  const phase = useRef(Math.random() * Math.PI * 2)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + phase.current
    ref.current.position.y = props.position[1] + Math.sin(t) * amplitude
    ref.current.rotation.y = t * 0.4
  })
  return (
    <group ref={ref} position={props.position}>
      {children}
    </group>
  )
}

function Mug({ position }) {
  return (
    <Bob position={position} speed={0.8}>
      <mesh>
        <cylinderGeometry args={[0.16, 0.14, 0.22, 10]} />
        <meshStandardMaterial color={HOME.yellow} flatShading />
        <Edges color={INK} threshold={20} />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.025, 6, 10]} />
        <meshStandardMaterial color={HOME.yellow} flatShading />
        <Edges color={INK} threshold={20} />
      </mesh>
    </Bob>
  )
}

function Pencil({ position }) {
  return (
    <Bob position={position} speed={0.6}>
      <group rotation={[0, 0, Math.PI / 5]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 0.9, 6]} />
          <meshStandardMaterial color={HOME.red} flatShading />
          <Edges color={INK} threshold={20} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.045, 0.12, 6]} />
          <meshStandardMaterial color={PAPER} flatShading />
          <Edges color={INK} threshold={20} />
        </mesh>
      </group>
    </Bob>
  )
}

function PaperBall({ position }) {
  return (
    <Bob position={position} speed={1.1} amplitude={0.1}>
      <mesh>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color={PAPER} flatShading />
        <Edges color={INK} threshold={1} />
      </mesh>
    </Bob>
  )
}

function Sparkle({ position }) {
  return (
    <Bob position={position} speed={1.6} amplitude={0.08}>
      <Star position={[0, 0, 0]} size={0.2} color={HOME.yellow} />
    </Bob>
  )
}

export function Doodles({ originZ = -6 }) {
  return (
    <group>
      <Mug position={[1.8, 1.6, originZ + 0.6]} />
      <Pencil position={[-2, 0.8, originZ - 1]} />
      <PaperBall position={[-1.6, 0.6, originZ + 1.2]} />
      <Sparkle position={[1.4, 2.6, originZ - 0.4]} />
      <Sparkle position={[-2.4, 2.2, originZ + 0.2]} />
    </group>
  )
}
