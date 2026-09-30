import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { getLinePoints, getCardPositions } from '../three/clothesline'
import { PhotoCard3D } from './PhotoCard3D'

export function PhotoClothesline({ photos, onInspect }) {
  const linePoints = useMemo(() => getLinePoints(), [])
  const cardPositions = useMemo(() => getCardPositions(photos.length), [photos.length])

  return (
    <group>
      <Line points={linePoints} color="#1a1a1a" lineWidth={1.5} />
      {photos.map((photo, i) => (
        <PhotoCard3D
          key={photo.name}
          photo={photo}
          position={cardPositions[i]}
          onInspect={onInspect}
        />
      ))}
    </group>
  )
}
