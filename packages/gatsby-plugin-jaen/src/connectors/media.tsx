import {useEffect, useMemo, useState} from 'react'
import {MediaNode} from 'src/components/cms/Media/types.js'
import {Media, MediaProps} from '../components/cms/Media/Media'

interface Photo {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

async function fetchRandomPhotos(
  page: number,
  count: number
): Promise<Photo[]> {
  const apiUrl = `https://picsum.photos/v2/list?page=${page}&limit=${count}`
  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch photos: ${response.status} ${response.statusText}`
    )
  }

  const data: Photo[] = await response.json()
  return data
}

export interface MediaConnectorProps {}

export const MediaConnector: React.FC<MediaConnectorProps> = () => {
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    void fetchRandomPhotos(1, 30).then(photos => {
      setPhotos(photos)
    })
  }, [])

  const media = useMemo(
    () =>
      photos.map((photo, i) => ({
        id: `${photo.id}-${i}`,
        preview: {
          url: photo.download_url
        },
        url: photo.download_url,
        description: photo.author,
        width: photo.width,
        height: photo.height,
        revisions: [] as MediaNode[]
      })),
    [photos]
  )

  const onUpload = (files: File[]) => {
    console.log(files)

    alert(`Uploaded ${files.length} files`)
  }

  const onDownload = (mediaId: string) => {
    console.log(mediaId)

    // Download media

    const m = media.find(photo => photo.id === mediaId)

    if (!m) {
      return
    }

    void fetch(m.url).then(async response => {
      if (!response.ok) {
        throw new Error(
          `Failed to download photo: ${response.status} ${response.statusText}`
        )
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = m.url.replace(/^.*[\\/]/, '')
      a.click()
      a.remove()
    })
  }

  const onDelete = (mediaId: string) => {
    console.log(mediaId)

    // Delete media

    const photoId = mediaId.split('-')[0]

    setPhotos(photos.filter(photo => photoId !== photo.id))
  }

  const onUpdate: MediaProps['onUpdate'] = (mediaId, media) => {
    console.log(mediaId, media)

    // Update media

    const photoId = mediaId.split('-')[0]

    setPhotos(
      photos.map(photo => {
        if (photoId === photo.id) {
          return {
            ...photo,
            ...media
          }
        }

        return photo
      })
    )
  }

  return (
    <Media
      mediaNodes={media}
      onUpload={onUpload}
      onDownload={onDownload}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  )
}
