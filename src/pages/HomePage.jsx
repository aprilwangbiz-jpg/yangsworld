import { useState } from 'react'
import { Corridor } from '../scenes/Corridor'

const TRANSITION_MS = 550

export function HomePage({ onEnterRoom }) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  function enterRoom(roomId) {
    if (isTransitioning) return
    setIsTransitioning(true)
    window.setTimeout(() => onEnterRoom(roomId), TRANSITION_MS)
  }

  return (
    <div className="scene-page scene-page--home">
      <Corridor onEnterRoom={enterRoom} />

      <div className="scene-badge">
        <span className="scene-badge-title">EXPLORER</span>
        <span>Scroll to walk down the corridor. Click a door to enter.</span>
      </div>

      <div className={`scene-fade${isTransitioning ? ' scene-fade--active' : ''}`} />
    </div>
  )
}
