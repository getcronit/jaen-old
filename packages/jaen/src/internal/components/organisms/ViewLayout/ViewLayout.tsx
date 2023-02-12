import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Stack,
  StackDivider
} from '@chakra-ui/react'

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
    <Flex boxSize="full" {...boxProps}>
      <Box
        w="100%"
        // maxW="container.xl"
        // mx="auto"
        // mt="4"
        // rounded="lg"
        // shadow="md"
        px={{
          base: 2,
          md: 4
        }}
        py={{
          base: 4,
          md: 8
        }}>
        <Stack divider={<StackDivider />} spacing="4">
          {heading && (
            <Heading size="xl" as="h1">
              {heading}
            </Heading>
          )}

          {children}
        </Stack>
      </Box>
    </Flex>
  )
}
