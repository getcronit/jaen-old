import {Box, BoxProps} from '@chakra-ui/react'

export interface ViewLayoutProps extends BoxProps {
  children: React.ReactNode
}

export const ViewLayout: React.FC<ViewLayoutProps> = ({
  children,
  ...boxProps
}) => {
  return (
    <Box bg="gray.50" boxSize={'full'} {...boxProps}>
      {children}
    </Box>
  )
}
