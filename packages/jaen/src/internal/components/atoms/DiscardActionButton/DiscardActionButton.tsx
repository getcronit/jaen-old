import {DeleteIcon} from '@chakra-ui/icons'
import {Button, IconButton, useBreakpointValue} from '@chakra-ui/react'
import {useDiscard} from './useDiscard.js'

export interface DiscardActionButtonProps {}

export const DiscardActionButton: React.FC<DiscardActionButtonProps> = () => {
  const isMobile = useBreakpointValue(
    {base: true, lg: false},
    {
      ssr: false
    }
  )

  const {discardChanges} = useDiscard()

  const handleClick = () => {
    void discardChanges()
  }

  if (isMobile) {
    return (
      <IconButton
        display={{base: 'flex', lg: 'none'}}
        borderRadius="full"
        icon={<DeleteIcon />}
        aria-label="Discard changes"
        onClick={handleClick}
      />
    )
  }

  return (
    <Button
      onClick={handleClick}
      display={{base: 'none', lg: 'flex'}}
      borderRadius="full"
      leftIcon={<DeleteIcon />}>
      Discard
    </Button>
  )
}
