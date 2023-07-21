import {
  Box,
  BoxProps,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  StackDivider
} from '@chakra-ui/react'
import {CLASSNAMES} from '../../../styles/constants'

export interface ViewLayoutProps extends BoxProps {
  heading?: string
  controls?: React.ReactNode[]
  fullscreen?: boolean
  children: React.ReactNode
}

export const ViewLayout: React.FC<ViewLayoutProps> = ({
  heading,
  children,
  fullscreen,
  controls,
  ...boxProps
}) => {
  if (fullscreen) {
    return <Box className={CLASSNAMES.JAEN_ADMIN_BODY}>{children}</Box>
  }

  return (
    <Stack
      boxSize="full"
      px={{
        base: 2,
        md: 4,
        lg: 8,
        xl: 12
      }}
      pt="4"
      spacing="4"
      {...boxProps}>
      <Flex>
        {heading && (
          <Heading size="lg" as="h1">
            {heading}
          </Heading>
        )}
        <Spacer />
        <HStack>{controls}</HStack>
      </Flex>

      <Box
        w="100%"
        bg="white"
        mx="auto"
        rounded="lg"
        shadow="md"
        px={{
          base: 2,
          md: 4
        }}
        py={{
          base: 4,
          md: 8
        }}>
        <Stack divider={<StackDivider />} spacing="4">
          {children}
        </Stack>
      </Box>
    </Stack>
  )
}
