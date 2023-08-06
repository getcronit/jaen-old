import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'
import {MediaNode, PageProvider, useMediaModal} from '@snek-at/jaen'

import Media from './media'

export interface MediaSelectorProps {
  isSelector?: boolean
  defaultSelected?: string
  jaenPageId?: string
  onSelect: (mediaNode: MediaNode) => void
}

const MediaModal: React.FC<MediaSelectorProps> = props => {
  const context = useMediaModal()

  return (
    <Modal isOpen={context.isOpen} onClose={context.toggleModal}>
      <ModalOverlay />
      <ModalContent
        maxW="96rem"
        containerProps={{
          id: 'coco'
        }}>
        {/* <ModalHeader>Modal Title</ModalHeader> */}
        <ModalCloseButton />
        <ModalBody p="1">
          <PageProvider
            jaenPage={{
              id: 'JaenPage /cms/media/'
              // missing static data from page-data.json
            }}>
            <Media
              isSelector={props.isSelector}
              onSelect={props.onSelect}
              defaultSelected={props.defaultSelected}
              jaenPageId={props.jaenPageId}
            />
          </PageProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MediaModal
