import { useCallback, useEffect, useState } from 'react'
import { supabase, PHOTO_BUCKET } from '../lib/supabase'
import { resizeImage } from '../lib/resizeImage'

const MAX_CAPTION_LENGTH = 80
const MAX_FILES = 10
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function captionFromFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_CAPTION_LENGTH)
}

function toPhoto(row) {
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(row.path)
  return { name: row.id, url: data.publicUrl, caption: row.caption }
}

// Lists, uploads and renames one album's photos in Supabase. Viewing works
// for everyone; upload/rename need the shared uploader session (see useUploader).
export function useFamilyPhotos(album) {
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState(supabase ? 'loading' : 'error') // loading | ready | error
  const [uploadStatus, setUploadStatus] = useState('idle') // idle | uploading | error

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('photos')
      .select('id, path, caption')
      .eq('album', album)
      .order('created_at', { ascending: false })
    if (error) {
      setStatus('error')
      return
    }
    setPhotos(data.map(toPhoto))
    setStatus('ready')
  }, [album])

  useEffect(() => {
    refresh()
  }, [refresh])

  const upload = useCallback(
    async (fileList) => {
      const files = Array.from(fileList ?? [])
        .filter((file) => ALLOWED_TYPES.has(file.type))
        .slice(0, MAX_FILES)
      if (files.length === 0 || !supabase) return

      setUploadStatus('uploading')
      try {
        for (const file of files) {
          const { blob, extension, contentType } = await resizeImage(file)
          const path = `${album}/${crypto.randomUUID()}.${extension}`
          const stored = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType })
          if (stored.error) throw stored.error
          const inserted = await supabase
            .from('photos')
            .insert({ album, path, caption: captionFromFilename(file.name) })
          if (inserted.error) throw inserted.error
        }
        await refresh()
        setUploadStatus('idle')
      } catch {
        await refresh() // show whatever did upload before the failure
        setUploadStatus('error')
      }
    },
    [album, refresh]
  )

  // Returns true on success so the caller can show a saved/error state.
  const rename = useCallback(
    async (id, caption) => {
      if (!supabase) return false
      const clean = String(caption ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_CAPTION_LENGTH)
      const { error } = await supabase.from('photos').update({ caption: clean }).eq('id', id)
      if (error) return false
      await refresh()
      return true
    },
    [refresh]
  )

  return { photos, status, uploadStatus, upload, rename }
}
