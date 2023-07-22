import {Box, Divider, HStack, StackProps, Text} from '@chakra-ui/react'

export interface DividerWithTextProps extends StackProps {}

export const DividerWithText: React.FC<DividerWithTextProps> = ({
  children,
  ...flexProps
}) => {
  return (
    <HStack color="gray.300" {...flexProps}>
      <Box flex="1">
        <Divider borderColor="currentcolor" />
      </Box>
      <Text as="span" px="3" color="gray.600" fontWeight="medium">
        {children}
      </Text>
      <Box flex="1">
        <Divider borderColor="currentcolor" />
      </Box>
    </HStack>
  )
}
