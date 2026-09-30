import { useRef, useState } from 'react'

const LABEL = {
  idle: '+ Add photos',
  uploading: 'Uploading…',
  error: "Couldn't upload — try again",
}

// Upload control for a photo room. Until this browser is unlocked with the
// shared password it shows an unlock form instead of the upload button.
export function PhotoUploadButton({ isUnlocked, onUnlock, uploadStatus, onUpload }) {
  const inputRef = useRef(null)
  const [isAsking, setIsAsking] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isChecking, setIsChecking] = useState(false)

  if (!isUnlocked) {
    if (!isAsking) {
      return (
        <button className="upload-btn" onClick={() => setIsAsking(true)}>
          {'🔒 Unlock uploads'}
        </button>
      )
    }

    return (
      <form
        className="unlock-form"
        onSubmit={async (e) => {
          e.preventDefault()
          setIsChecking(true)
          const message = await onUnlock(password)
          setIsChecking(false)
          setError(message)
          if (!message) setPassword('')
        }}
      >
        <label htmlFor="upload-password">Password</label>
        <input
          id="upload-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="upload-btn" disabled={isChecking || !password}>
          {isChecking ? 'Checking…' : 'Unlock'}
        </button>
        {error && <span className="inspect-status--error">{error}</span>}
      </form>
    )
  }

  return (
    <>
      <button
        className="upload-btn"
        disabled={uploadStatus === 'uploading'}
        onClick={() => inputRef.current?.click()}
      >
        {LABEL[uploadStatus] ?? LABEL.idle}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        hidden
        onChange={(e) => {
          onUpload(e.target.files)
          e.target.value = ''
        }}
      />
    </>
  )
}
