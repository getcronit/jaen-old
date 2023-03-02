import {
  Button,
  ButtonProps,
  Icon,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react'
import {BiRocket} from 'react-icons/bi'
import {useModals} from '../../../context/Modals/index.js'
import {usePublish} from '../../../hooks/usePublish.js'

export interface PublishActionButtonProps {}

export const PublishActionButton: React.FC<PublishActionButtonProps> = () => {
  const {confirm, toast} = useModals()

  const {isPublishing, publish} = usePublish()

  const isMobile = useBreakpointValue(
    {base: true, md: false},
    {
      ssr: false
    }
  )

  const handleClick = async () => {
    const shouldPublish = await confirm(
      `Are you sure you want to publish this page?`
    )

    if (!shouldPublish) {
      return
    }

    toast({
      title: `Publishing...`,
      description: `Your page is being published. This may take a few minutes.`,
      status: 'success',
      isClosable: true
    })

    await publish()
  }

  const commonProps: ButtonProps = {
    onClick: handleClick,
    isLoading: isPublishing
  }

  if (isMobile) {
    return (
      <IconButton
        icon={<Icon as={BiRocket} boxSize="5" />}
        aria-label="Publish now"
        {...commonProps}
      />
    )
  }

  return (
    <Button
      variant="solid"
      leftIcon={<Icon as={BiRocket} boxSize="5" />}
      {...commonProps}>
      Publish now
    </Button>
  )
}
