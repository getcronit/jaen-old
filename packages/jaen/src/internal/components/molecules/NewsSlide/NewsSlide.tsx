import {
  CloseButton,
  Divider,
  Flex,
  FlexProps,
  Heading,
  HStack,
  SlideFade,
  Stack,
  StackDivider
} from '@chakra-ui/react'
import {useNewsSlide} from '../../../context/NewsSlideContext.js'

export interface NewsSlideProps extends FlexProps {}

export const NewsSlide: React.FC<NewsSlideProps> = ({...flexProps}) => {
  const {ref, isOpen, onClose, isLoading, data} = useNewsSlide()

  const closeIfNotRefHandler: React.MouseEventHandler = e => {
    if (!ref?.current?.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <Flex
      h="full"
      w="full"
      flexDir="row-reverse"
      bg={isOpen ? 'rgba(0,0,0,0.3)' : 'transparent'}
      pointerEvents={isOpen ? undefined : 'none'}
      cursor="default"
      onClick={closeIfNotRefHandler}
      {...flexProps}>
      <SlideFade offsetY={0} in={isOpen}>
        <Stack
          borderY="1px"
          borderColor="gray.200"
          ref={ref}
          bg="white"
          minW="lg"
          h="full"
          borderLeftRadius="md"
          shadow="md"
          divider={<StackDivider />}>
          <Stack>
            <HStack p="6" justifyContent="space-between">
              <Heading as="h2" fontSize="2xl" fontWeight="bold">
                What&apos;s new at Jaen
              </Heading>
              <CloseButton onClick={onClose} />
            </HStack>
            <Divider />

            <Stack p="6" spacing="6">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                data?.items?.map(item => <div key={item.id}>{item.title}</div>)
              )}
            </Stack>
          </Stack>
        </Stack>
      </SlideFade>
    </Flex>
  )
}
