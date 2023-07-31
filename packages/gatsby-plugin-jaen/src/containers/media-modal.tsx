import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay
} from '@chakra-ui/react'
import {PageProvider, useMediaModal} from '@snek-at/jaen'

import {MediaNode} from '../components/cms/Media/types'
import {withTheme} from '../theme/with-theme'
import Media from './media'

export interface MediaSelectorProps {
  isSelector?: boolean
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
            <Media isSelector={props.isSelector} onSelect={props.onSelect} />
          </PageProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default withTheme(MediaModal)
