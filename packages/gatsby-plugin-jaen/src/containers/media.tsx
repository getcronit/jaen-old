import {Media, MediaProps} from '../components/cms/Media/Media'
import {MediaNode} from '../components/cms/Media/types'

export interface MediaContainerProps {
  mediaNodes: MediaNode[]
}

export const MediaContainer: React.FC<MediaContainerProps> = ({mediaNodes}) => {
  const onUpload = (files: File[]) => {
    console.log(files)

    alert(`Uploaded ${files.length} files`)
  }

  const onDownload = (mediaId: string) => {
    console.log(mediaId)

    // Download media

    const m = mediaNodes.find(media => media.id === mediaId)

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

    // const photoId = mediaId.split('-')[0]

    // setPhotos(photos.filter(photo => photoId !== photo.id))
  }

  const onUpdate: MediaProps['onUpdate'] = (mediaId, media) => {
    console.log(mediaId, media)

    // Update media

    // const photoId = mediaId.split('-')[0]

    // setPhotos(
    //   photos.map(photo => {
    //     if (photoId === photo.id) {
    //       return {
    //         ...photo,
    //         ...media
    //       }
    //     }

    //     return photo
    //   })
    // )
  }

  return (
    <Media
      mediaNodes={mediaNodes}
      onUpload={onUpload}
      onDownload={onDownload}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  )
}
