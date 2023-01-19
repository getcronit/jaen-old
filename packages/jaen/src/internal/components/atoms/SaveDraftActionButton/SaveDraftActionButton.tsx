import {
  Badge,
  Button,
  ButtonProps,
  Icon,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react'
import {useEffect} from 'react'
import {BiSave} from 'react-icons/bi'

import {useModals} from '../../../context/Modals/ModalContext.js'
import {useSaveDraft} from '../../../hooks/draft/useSaveDraft.js'

export interface SaveDraftActionButtonProps {}

export const SaveDraftActionButton: React.FC<SaveDraftActionButtonProps> =
  () => {
    const isMobile = useBreakpointValue(
      {base: true, lg: false},
      {
        ssr: false
      }
    )

    const {toast} = useModals()

    const {isSaving, isSaved, saveDraft} = useSaveDraft()

    useEffect(() => {
      if (isSaved) {
        toast({
          title: 'Draft saved',
          description: 'Your draft has been saved',
          status: 'success'
        })
      }
    }, [isSaved])

    const saveProps: ButtonProps = {
      isLoading: isSaving,
      onClick: () => {
        void saveDraft()
      }
    }

    if (isMobile) {
      return (
        <IconButton
          borderRadius="full"
          icon={<Icon as={BiSave} boxSize="5" />}
          aria-label="Save draft"
          {...saveProps}
        />
      )
    }

    return (
      <Button
        borderRadius="full"
        leftIcon={<Icon as={BiSave} boxSize="5" />}
        rightIcon={<Badge rounded="full">1</Badge>}
        {...saveProps}>
        Save draft
      </Button>
    )
  }
