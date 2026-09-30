import { useState } from 'react'
import { FamilyGallery } from '../scenes/FamilyGallery'
import { PhotoLightbox } from '../scenes/PhotoLightbox'
import { PhotoUploadButton } from '../scenes/PhotoUploadButton'
import { useFamilyPhotos } from '../hooks/useFamilyPhotos'
import { useUploader } from '../hooks/useUploader'

function badgeText(status, photoCount, isUnlocked) {
  if (status === 'error') return "Couldn't load photos right now."
  if (status === 'ready' && photoCount === 0) {
    return isUnlocked ? 'No photos yet — add the first one.' : 'No photos yet.'
  }
  return isUnlocked ? 'Click a photo to see it full-size and name it.' : 'Click a photo to see it full-size.'
}

// Every corridor door opens one of these — same room, different album.
export function FamilyPage({ room, onBack }) {
  const { photos, status, uploadStatus, upload, rename } = useFamilyPhotos(room.id)
  const { isUnlocked, unlock } = useUploader()
  const [viewingName, setViewingName] = useState(null)
  const viewing = photos.find((photo) => photo.name === viewingName)

  return (
    <div className="scene-page">
      <FamilyGallery photos={photos} onInspect={(photo) => setViewingName(photo.name)} />

      <button className="scene-back" onClick={onBack} aria-label="Back to corridor">
        {'‹'}
      </button>

      <div className="upload-corner">
        <PhotoUploadButton
          isUnlocked={isUnlocked}
          onUnlock={unlock}
          uploadStatus={uploadStatus}
          onUpload={upload}
        />
      </div>

      <div className="scene-badge">
        <span className="scene-badge-title">{room.label}</span>
        <span>{badgeText(status, photos.length, isUnlocked)}</span>
      </div>

      {viewing && (
        <PhotoLightbox
          key={viewing.name}
          photo={viewing}
          canRename={isUnlocked}
          onRename={(caption) => rename(viewing.name, caption)}
          onClose={() => setViewingName(null)}
        />
      )}
    </div>
  )
}
