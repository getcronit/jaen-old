import {Box, BoxProps, Heading, Stack, StackDivider} from '@chakra-ui/react'

export interface ViewLayoutProps extends BoxProps {
  heading?: string
  children: React.ReactNode
}

export const ViewLayout: React.FC<ViewLayoutProps> = ({
  heading,
  children,
  ...boxProps
}) => {
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
      {heading && (
        <Heading size="lg" as="h1">
          {heading}
        </Heading>
      )}
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
