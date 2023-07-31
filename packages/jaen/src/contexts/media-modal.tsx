import React, {createContext, useContext, useEffect, useState} from 'react'

// Define the context type
type MediaModalContextType = {
  isOpen: boolean
  MediaModalComponent: React.LazyExoticComponent<any>
  toggleModal: (isSelector?: boolean) => void
}

// Create the initial context with default values
const MediaModalContext = createContext<MediaModalContextType>({
  isOpen: false,
  MediaModalComponent: undefined as any,
  toggleModal: () => {}
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
  }>({
    isOpen: false,
    isSelector: false
  })

  const toggleModal = (isSelector: boolean = false) => {
    setOpen({
      isOpen: !open.isOpen,
      isSelector
    })
  }

  const handleSelect = (mediaNode: any) => {
    const onSelectEvent = new CustomEvent('mediaNodeSelected', {
      detail: mediaNode
    })
    window.dispatchEvent(onSelectEvent)
  }

  return (
    <MediaModalContext.Provider
      value={{MediaModalComponent, isOpen: open.isOpen, toggleModal}}>
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
  onSelect?: (mediaNode: any) => void
}

export const useMediaModal = (args?: UseMediaModalArgs) => {
  const context = useContext(MediaModalContext) as MediaModalContextType
  if (!context) {
    throw new Error('useMediaModal must be used within a MediaModalProvider')
  }

  useEffect(() => {
    if (!args?.onSelect) return

    const onSelectHandler: EventListener = (event: CustomEvent) => {
      // Check if the event is the 'mediaNodeSelected' event
      if (event.type === 'mediaNodeSelected') {
        const selectedMediaNode = event.detail
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
    toggleModal: () => context.toggleModal(!!args?.onSelect),
    isOpen: context.isOpen
  }
}
