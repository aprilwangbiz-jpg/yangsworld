import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Line, useTexture } from '@react-three/drei'

// 3D version of leaf-door.html: a pointed-arch double door painted with the
// stained-glass leaf, a gold frame, a center seam with two knobs, and halves
// that swing open (optionally onto a warm golden glow). Sized by `width`;
// height keeps the source 600 x 1100 proportions.

const ART_URL = `${import.meta.env.BASE_URL}images/leaf-door.webp`
const GOLD = '#d9b25a'
const KNOB = '#e6c877'
const SEAM = '#b8914a'
const SRC_W = 600
const SRC_H = 1100

export function leafDoorHeight(width) {
  return (width * SRC_H) / SRC_W
}

// Maps a point from the 600x1100 design (y down) into door space: x centered, y up from the floor.
function mapper(width) {
  const height = leafDoorHeight(width)
  return (x, y) => [((x - SRC_W / 2) / SRC_W) * width, ((SRC_H - y) / SRC_H) * height]
}

// The arch curves match the SVG path
// M0,1100 L0,440 C0,300 170,130 300,22 C430,130 600,300 600,440 L600,1100 Z.
function traceLeft(path, p) {
  path.lineTo(...p(0, 440))
  path.bezierCurveTo(...p(0, 300), ...p(170, 130), ...p(300, 22))
}

function traceRight(path, p) {
  path.bezierCurveTo(...p(430, 130), ...p(600, 300), ...p(600, 440))
  path.lineTo(...p(600, 1100))
}

export function leafDoorOutline(width, PathClass = THREE.Shape) {
  const p = mapper(width)
  const s = new PathClass()
  s.moveTo(...p(0, 1100))
  traceLeft(s, p)
  traceRight(s, p)
  s.closePath()
  return s
}

function leftHalfShape(p) {
  const s = new THREE.Shape()
  s.moveTo(...p(0, 1100))
  traceLeft(s, p)
  s.lineTo(...p(300, 1100))
  s.closePath()
  return s
}

function rightHalfShape(p) {
  const s = new THREE.Shape()
  s.moveTo(...p(300, 22))
  traceRight(s, p)
  s.lineTo(...p(300, 1100))
  s.closePath()
  return s
}

// UVs span the whole door so each half shows its side of the painting.
function doorGeometry(shape, width, height, shiftX = 0) {
  const geometry = new THREE.ShapeGeometry(shape, 24)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    geometry.attributes.uv.setXY(i, pos.getX(i) / width + 0.5, pos.getY(i) / height)
  }
  geometry.translate(shiftX, 0, 0)
  return geometry
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 470
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(128, 210, 10, 128, 210, 260)
  g.addColorStop(0, '#fff6d8')
  g.addColorStop(0.35, '#f2c86a')
  g.addColorStop(0.8, '#7a5320')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * @param {object} props
 * @param {number} props.width door width in world units
 * @param {() => number} props.getAngle called every frame; returns the target swing angle (radians)
 * @param {boolean} [props.glow] show the golden glow behind the halves
 * @param {boolean} [props.showSeam] draw the center seam + knobs
 * @param {number} [props.frameWidth] gold frame line width in pixels
 */
export function LeafDoor({ width, getAngle, glow = true, showSeam = true, frameWidth = 4, ...handlers }) {
  const art = useTexture(ART_URL)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const height = leafDoorHeight(width)

  const parts = useMemo(() => {
    const p = mapper(width)
    const outline = leafDoorOutline(width)
    return {
      left: doorGeometry(leftHalfShape(p), width, height, width / 2),
      right: doorGeometry(rightHalfShape(p), width, height, -width / 2),
      glow: doorGeometry(outline, width, height),
      glowTexture: makeGlowTexture(),
      frame: outline.getPoints(24).map((pt) => [pt.x, pt.y, 0.03]),
      knobY: p(0, 640)[1],
      seamTop: p(0, 22)[1],
    }
  }, [width, height])

  useFrame(() => {
    const target = getAngle()
    if (leftRef.current) leftRef.current.rotation.y += (-target - leftRef.current.rotation.y) * 0.12
    if (rightRef.current) rightRef.current.rotation.y += (target - rightRef.current.rotation.y) * 0.12
  })

  const knobGap = width * 0.03
  const knobRadius = width * 0.019

  return (
    <group>
      {glow && (
        <mesh geometry={parts.glow} position={[0, 0, 0.005]}>
          <meshBasicMaterial map={parts.glowTexture} toneMapped={false} />
        </mesh>
      )}

      <group {...handlers}>
        <group ref={leftRef} position={[-width / 2, 0, 0.02]}>
          <mesh geometry={parts.left}>
            <meshBasicMaterial map={art} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>
        <group ref={rightRef} position={[width / 2, 0, 0.02]}>
          <mesh geometry={parts.right}>
            <meshBasicMaterial map={art} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {showSeam && (
        <>
          <Line points={[[0, 0, 0.025], [0, parts.seamTop, 0.025]]} color={SEAM} lineWidth={1.5} />
          {[-knobGap, knobGap].map((x) => (
            <mesh key={x} position={[x, parts.knobY, 0.03]}>
              <circleGeometry args={[knobRadius, 16]} />
              <meshBasicMaterial color={KNOB} />
            </mesh>
          ))}
        </>
      )}

      <Line points={parts.frame} color={GOLD} lineWidth={frameWidth} />
    </group>
  )
}
