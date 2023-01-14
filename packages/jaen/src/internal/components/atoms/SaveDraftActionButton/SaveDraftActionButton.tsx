import {
  Badge,
  Button,
  Icon,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react'
import {BiSave} from 'react-icons/bi'

export interface SaveDraftActionButtonProps {}

export const SaveDraftActionButton: React.FC<SaveDraftActionButtonProps> =
  () => {
    const isMobile = useBreakpointValue(
      {base: true, lg: false},
      {
        ssr: false
      }
    )

    if (isMobile) {
      return (
        <IconButton
          display={{base: 'flex', lg: 'none'}}
          borderRadius="full"
          icon={<Icon as={BiSave} boxSize="5" />}
          aria-label="Save draft"
        />
      )
    }

    return (
      <Button
        display={{base: 'none', lg: 'flex'}}
        borderRadius="full"
        leftIcon={<Icon as={BiSave} boxSize="5" />}
        rightIcon={<Badge rounded="full">1</Badge>}>
        Save draft
      </Button>
    )
  }
