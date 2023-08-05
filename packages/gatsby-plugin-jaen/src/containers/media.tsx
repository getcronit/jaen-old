import React, {useEffect, useMemo, useState} from 'react'
import {MediaNode, uploadFile, useField} from '@snek-at/jaen'
import {v4 as uuidv4} from 'uuid'

import {Media, MediaProps} from '../components/cms/Media/Media'
import {useCMSManagement, withCMSManagement} from '../connectors/cms-management'

export interface MediaContainerProps {
  isSelector?: boolean
  onSelect?: (mediaNode: MediaNode) => void
}

const MediaContainer: React.FC<MediaContainerProps> = props => {
  const field = useField<{
    [id: string]: MediaNode
  }>('media_nodes', 'IMA:MEDIA_NODES')
  const [mediaNodes, setMediaNodes] = useState<{
    [id: string]: MediaNode
  }>(field.staticValue || {})

  const manager = useCMSManagement()

  useEffect(() => {
    if (field.value) {
      setMediaNodes(field.value)
    }
  }, [field.value])

  const onUpload = async (files: File[]) => {
    try {
      const uploadedMediaNodes = await Promise.all(
        files.map(async file => {
          const {data, fileUrl, fileThumbUrl} = await uploadFile(file)
          const dimensions = await new Promise<{width: number; height: number}>(
            resolve => {
              const img = new Image()
              img.onload = () => {
                resolve({width: img.width, height: img.height})
              }
              img.src = fileUrl
            }
          )

          const newMediaNode: MediaNode = {
            id: uuidv4(),
            fileUniqueId: data.file_unique_id,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            description: data.file_name,
            preview: fileThumbUrl ? {url: fileThumbUrl} : undefined,
            url: fileUrl,
            width: dimensions.width,
            height: dimensions.height,
            revisions: []
          }

          return newMediaNode
        })
      )

      // for (const file of files) {
      //   const {data, fileUrl, fileThumbUrl} = await uploadFile(file)
      //   const dimensions = await new Promise<{width: number; height: number}>(
      //     resolve => {
      //       const img = new Image()
      //       img.onload = () => {
      //         resolve({width: img.width, height: img.height})
      //       }
      //       img.src = fileUrl
      //     }
      //   )

      //   const newMediaNode: MediaNode = {
      //     id: data.file_unique_id,
      //     createdAt: new Date().toISOString(),
      //     modifiedAt: new Date().toISOString(),
      //     preview: fileThumbUrl ? {url: fileThumbUrl} : undefined,
      //     url: fileUrl,
      //     width: dimensions.width,
      //     height: dimensions.height,
      //     revisions: []
      //   }

      //   field.write({
      //     ...mediaNodes,
      //     [newMediaNode.id]: newMediaNode
      //   })
      // }

      field.write({
        ...mediaNodes,
        ...uploadedMediaNodes.reduce<{[id: string]: MediaNode}>(
          (acc, mediaNode) => {
            acc[mediaNode.id] = mediaNode
            return acc
          },
          {}
        )
      })
    } catch (error) {
      return
    }
  }

  const onDownload = (mediaId: string) => {
    // Download media
    const mediaToDownload = mediaNodes[mediaId]

    if (mediaToDownload) {
      void fetch(mediaToDownload.url)
        .then(async response => {
          if (!response.ok) {
            throw new Error(
              `Failed to download photo: ${response.status} ${response.statusText}`
            )
          }

          const blob = await response.blob()
          const blobUrl = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = mediaToDownload.url.replace(/^.*[\\/]/, '')
          a.click()
          a.remove()
        })
        .catch(error => {
          // Handle download error gracefully, show error message to user, etc.
        })
    }
  }

  const onDelete = (mediaId: string) => {
    const mutableMediaNodes = {...mediaNodes}

    delete mutableMediaNodes[mediaId]

    field.write(mutableMediaNodes)
  }

  const onUpdate: MediaProps['onUpdate'] = async (mediaId, media) => {
    const mutableMediaNodes = {...mediaNodes}

    // Update media
    const foundMedia = mutableMediaNodes[mediaId]

    if (!foundMedia) {
      return
    }

    const updatedMedia = {
      ...foundMedia,
      ...media
    }

    // skip if no changes were made
    if (JSON.stringify(foundMedia) === JSON.stringify(updatedMedia)) {
      return
    }

    const preparedRevision = {
      ...foundMedia
    }

    delete preparedRevision.revisions

    // add revision
    updatedMedia.revisions = [
      ...(updatedMedia.revisions || []),
      preparedRevision
    ]

    // delete file from media because it should not be saved
    delete updatedMedia.file

    if (media.file) {
      try {
        // upload new file
        const {fileUrl, fileThumbUrl, data} = await uploadFile(media.file)

        updatedMedia.fileUniqueId = data.file_unique_id

        updatedMedia.modifiedAt = new Date().toISOString()
        updatedMedia.url = fileUrl
        updatedMedia.preview = fileThumbUrl ? {url: fileThumbUrl} : undefined

        const dimensions = await new Promise<{width: number; height: number}>(
          resolve => {
            const img = new Image()
            img.onload = () => {
              resolve({width: img.width, height: img.height})
            }
            img.src = fileUrl
          }
        )

        updatedMedia.width = dimensions.width
        updatedMedia.height = dimensions.height
      } catch (error) {
        // Handle upload error gracefully, show error message to user, etc.
        return
      }
    }

    mutableMediaNodes[mediaId] = updatedMedia

    field.write(mutableMediaNodes)
  }

  const onSelect = (mediaId: string) => {
    const selectedMediaNode = mediaNodes[mediaId]

    if (props.isSelector && props.onSelect && selectedMediaNode) {
      props.onSelect(selectedMediaNode)
    }
  }

  const mediaNodesValues = useMemo(
    () => Object.values(mediaNodes),
    [mediaNodes]
  )

  return (
    <Media
      isSelector={props.isSelector}
      tree={manager.tree}
      mediaNodes={mediaNodesValues}
      onUpload={onUpload}
      onDownload={onDownload}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onSelect={onSelect}
    />
  )
}

export default withCMSManagement(MediaContainer)
