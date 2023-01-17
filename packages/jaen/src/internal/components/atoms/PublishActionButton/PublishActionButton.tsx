import {Button, Icon, IconButton, useBreakpointValue} from '@chakra-ui/react'
import {BiRocket} from 'react-icons/bi'

export interface PublishActionButtonProps {}

export const PublishActionButton: React.FC<PublishActionButtonProps> = () => {
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
        icon={<Icon as={BiRocket} boxSize="5" />}
        aria-label="Publish now"
      />
    )
  }

  return (
    <Button
      display={{base: 'none', lg: 'flex'}}
      variant="solid"
      leftIcon={<Icon as={BiRocket} boxSize="5" />}>
      Publish now
    </Button>
  )
}
