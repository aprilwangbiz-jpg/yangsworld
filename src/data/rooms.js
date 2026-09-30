// Every corridor door opens a photo room. `id` doubles as the album folder
// name under public/uploads/, so the dev upload endpoint also imports this
// list to whitelist albums. Change a label here to rename a door's room.
export const ROOMS = [
  { id: 'garden', label: 'GARDEN' },
  { id: 'about', label: 'ABOUT' },
  { id: 'family', label: 'FAMILY' },
  { id: 'portfolio', label: 'PORTFOLIO' },
  { id: 'travel', label: 'TRAVEL' },
  { id: 'friends', label: 'FRIENDS' },
]

export const ROOM_IDS = new Set(ROOMS.map((room) => room.id))
