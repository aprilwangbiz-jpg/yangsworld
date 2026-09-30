import { useState } from 'react'

const MAX_CAPTION_LENGTH = 80

// Full-size photo view. The name is editable only when uploads are unlocked.
export function PhotoLightbox({ photo, canRename, onRename, onClose }) {
  const [draft, setDraft] = useState(photo.caption)
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveStatus('saving')
    setSaveStatus((await onRename(draft)) ? 'saved' : 'error')
  }

  return (
    <div className="inspect-overlay" onClick={onClose}>
      <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
        <button className="inspect-close" onClick={onClose} aria-label="Close">
          {'✕'}
        </button>
        <img className="lightbox-image" src={photo.url} alt={photo.caption || 'Photo'} />
        {canRename ? (
          <form className="lightbox-name" onSubmit={handleSubmit}>
            <label htmlFor="photo-name">Name</label>
            <input
              id="photo-name"
              value={draft}
              maxLength={MAX_CAPTION_LENGTH}
              placeholder="Name this picture"
              onChange={(e) => {
                setDraft(e.target.value)
                setSaveStatus('idle')
              }}
            />
            <button type="submit" className="upload-btn" disabled={saveStatus === 'saving'}>
              {saveStatus === 'saved' ? 'Saved ✓' : 'Save'}
            </button>
            {saveStatus === 'error' && <span className="inspect-status--error">Couldn't save — try again</span>}
          </form>
        ) : (
          photo.caption && <p className="lightbox-name">{photo.caption}</p>
        )}
      </div>
    </div>
  )
}
