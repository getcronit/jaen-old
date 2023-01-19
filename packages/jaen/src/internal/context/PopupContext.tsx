import {
  As,
  Modal,
  ModalContent,
  ModalContentProps,
  ModalOverlay,
  ModalProps,
  useDisclosure
} from '@chakra-ui/react'
import React from 'react'
import {RequireAtLeastOne} from '../../@types/RequireAtLeastOne.js'

import {IJaenPopup, PageProps} from '../../types.js'
import {useEdit} from '../components/atoms/EditActionButton/useEdit.js'
import {useAppDispatch} from '../redux/index.js'

import * as internalActions from '../redux/slices/popup.js'

export interface IPopupOptions {
  label: string
  description: string
  imageURL: string
  modalProps?: Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>
  modalContentProps?: ModalContentProps
  conditions: RequireAtLeastOne<{
    entireSite: boolean
    templates: string[]
    urlPatterns: string[]
  }>
  triggers: RequireAtLeastOne<{
    onPageLoad: number
    onPageScroll: {
      percentage: number
      direction: 'up' | 'down'
    }
  }>
  advanced?: Partial<{
    showAfterXPageViews: number
    showUntilXPageViews: number
  }>
  logo?: As<any>
  customCondition?: (props: PageProps) => boolean
  customTrigger?: () => Promise<boolean>
}

export interface PopupContextType {
  id: string
  popup?: IJaenPopup
}

export const PopupContext =
  React.createContext<PopupContextType | undefined>(undefined)

export const usePopupContext = () => {
  const context = React.useContext(PopupContext)

  if (!context) {
    throw new Error('usePopupContext must be used within a PopupProvider')
  }

  return context
}

export interface PopupProviderProps extends IPopupOptions {
  id: string
  popup?: IJaenPopup
  forceOpen?: boolean
  onClose?: () => void
}

export interface PopupProviderInternalProps {
  id: string
  children: React.ReactNode
  editable?: boolean
}

export const PopupProvider: React.FC<
  PopupProviderProps & PopupProviderInternalProps
> = ({
  id,
  popup,
  children,
  modalProps,
  modalContentProps,
  triggers,
  customTrigger,
  advanced,
  forceOpen,
  onClose: onCloseProp,
  editable = false
}) => {
  const dispatch = useAppDispatch()
  const {isOpen, onClose, onOpen} = useDisclosure({
    defaultIsOpen: false,
    isOpen: forceOpen
  })

  const {isEditing, setEditing} = useEdit()

  React.useEffect(() => {
    // Check if the component is editable
    if (editable) {
      const justOpened = isOpen && !isEditing
      // Enable editing if the component was just opened
      if (justOpened) {
        setEditing(true)
      }
    }
  }, [isEditing, isOpen, editable])

  const handleClose = React.useCallback(() => {
    onCloseProp?.()
    onClose()
  }, [onCloseProp, onClose])

  React.useEffect(() => {
    const handleOpen = async () => {
      if (customTrigger) {
        const shouldOpen = await customTrigger()
        if (shouldOpen) {
          onOpen()
        }
      }
    }

    void handleOpen()
  }, [isOpen])

  React.useEffect(() => {
    if (triggers) {
      if (triggers.onPageLoad) {
        // wait onPageLoad seconds before opening
        setTimeout(() => {
          onOpen()
        }, triggers.onPageLoad * 1000)
      }

      if (triggers.onPageScroll) {
        const {percentage, direction} = triggers.onPageScroll
        const handleScroll = () => {
          const scrollPercentage =
            window.pageYOffset /
            (document.body.offsetHeight - window.innerHeight)

          if (
            (direction === 'up' && scrollPercentage < percentage) ||
            (direction === 'down' && scrollPercentage > percentage)
          ) {
            onOpen()
            window.removeEventListener('scroll', handleScroll)
          }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
          window.removeEventListener('scroll', handleScroll)
        }
      }
    }

    return () => {}
  }, [])

  React.useEffect(() => {
    if (advanced) {
      if (advanced.showAfterXPageViews || advanced.showUntilXPageViews) {
        const {showAfterXPageViews, showUntilXPageViews} = advanced

        if (showAfterXPageViews || showUntilXPageViews) {
          dispatch(internalActions.increaseAdvancedPageViews(id))
        }
      }
    }
  }, [advanced])

  return (
    <PopupContext.Provider value={{id, popup}}>
      <Modal isOpen={isOpen} onClose={handleClose} {...modalProps}>
        <ModalOverlay />
        <ModalContent {...modalContentProps}>{children}</ModalContent>
      </Modal>
    </PopupContext.Provider>
  )
}
