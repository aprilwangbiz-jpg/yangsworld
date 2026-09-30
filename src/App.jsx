import { useState } from 'react'
import { HomePage } from './pages/HomePage'
import { FamilyPage } from './pages/FamilyPage'
import { ROOMS } from './data/rooms'

export default function App() {
  const [roomId, setRoomId] = useState(null)
  const room = ROOMS.find((r) => r.id === roomId)

  if (room) {
    return <FamilyPage key={room.id} room={room} onBack={() => setRoomId(null)} />
  }

  return <HomePage onEnterRoom={setRoomId} />
}
