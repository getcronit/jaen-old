import React, {createContext, useContext, useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid' // Import uuid to generate unique IDs
import {MediaNode} from '../types'
import {uploadFile} from '../utils/open-storage-gateway'

// Define the context type
type MediaModalContextType = {
  isOpen: boolean
  MediaModalComponent: React.LazyExoticComponent<any>
  toggleModal: (args?: {isSelector?: boolean; id?: string}) => void
  togglFileSelector: () => Promise<MediaNode>
}

// Create the initial context with default values
const MediaModalContext = createContext<MediaModalContextType>({
  isOpen: false,
  MediaModalComponent: undefined as any,
  toggleModal: () => {},
  togglFileSelector: () => Promise.resolve({} as MediaNode)
})

export interface MediaModalProviderProps {
  MediaModalComponent: React.LazyExoticComponent<any>
  children: React.ReactNode
}

// Define the MediaModalProvider component
export const MediaModalProvider: React.FC<MediaModalProviderProps> = ({
  MediaModalComponent,
  children
}) => {
  const [open, setOpen] = useState<{
    isOpen: boolean
    isSelector: boolean
    id: string
  }>({
    isOpen: false,
    isSelector: false,
    id: 'default'
  })

  const toggleModal = (args?: {isSelector?: boolean; id?: string}) => {
    setOpen({
      isOpen: !open.isOpen,
      isSelector: !!args?.isSelector,
      id: args?.id || 'default'
    })
  }

  const togglFileSelector = async () => {
    // open file dialog for file selection
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'

    const uploadedData = await new Promise<ReturnType<typeof uploadFile>>(
      (resolve, reject) => {
        fileInput.addEventListener('change', () => {
          const selectedFile = fileInput.files?.[0]
          if (selectedFile) {
            const mediaFile = uploadFile(selectedFile)

            resolve(mediaFile) // Resolve the promise with the selected file object
          } else {
            reject(new Error('No file selected')) // Reject the promise if no file is selected
          }
        })

        // In case the user cancels the file selection dialog
        fileInput.addEventListener('cancel', () => {
          reject(new Error('File selection canceled'))
        })

        // Trigger the file input dialog
        fileInput.click()
      }
    )

    const {data, fileUrl, fileThumbUrl} = uploadedData
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
  }

  const handleSelect = (mediaNode: MediaNode) => {
    const onSelectEvent = new CustomEvent('mediaNodeSelected', {
      detail: {
        mediaNode,
        uniqueId: open.id
      }
    })
    window.dispatchEvent(onSelectEvent)
  }

  return (
    <MediaModalContext.Provider
      value={{
        MediaModalComponent,
        isOpen: open.isOpen,
        toggleModal,
        togglFileSelector
      }}>
      {open.isOpen && (
        <React.Suspense>
          <MediaModalComponent
            onSelect={handleSelect}
            isSelector={open.isSelector}
          />
        </React.Suspense>
      )}
      {children}
    </MediaModalContext.Provider>
  )
}

export interface UseMediaModalArgs {
  onSelect?: (mediaNode: MediaNode) => void
}

export const useMediaModal = (args?: UseMediaModalArgs) => {
  const context = useContext(MediaModalContext) as MediaModalContextType
  if (!context) {
    throw new Error('useMediaModal must be used within a MediaModalProvider')
  }

  const [uniqueId] = useState<string>(uuidv4())

  useEffect(() => {
    if (!args?.onSelect) return

    const onSelectHandler: EventListener = (event: CustomEvent) => {
      // Check if the event is the 'mediaNodeSelected' event
      if (
        event.type === 'mediaNodeSelected' &&
        event.detail.uniqueId === uniqueId
      ) {
        const selectedMediaNode = event.detail.mediaNode
        // Call the onSelect callback with the selected media node

        args?.onSelect?.(selectedMediaNode)

        context.toggleModal()
      }
    }

    // Add event listener to capture the 'mediaNodeSelected' event
    window.addEventListener('mediaNodeSelected', onSelectHandler)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('mediaNodeSelected', onSelectHandler)
    }
  }, [context.toggleModal])

  if (!context) {
    throw new Error('useMediaModal must be used within a MediaModalProvider')
  }

  return {
    toggleModal: () =>
      context.toggleModal({
        id: uniqueId,
        isSelector: !!args?.onSelect
      }),
    isOpen: context.isOpen,
    togglFileSelector: async () => {
      const mediaFile = await context.togglFileSelector()

      if (mediaFile) {
        args?.onSelect?.(mediaFile)
      }
    }
  }
}
