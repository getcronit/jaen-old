import {
  StatLabel as ChakraStatLabel,
  StatLabelProps,
  useColorModeValue
} from '@chakra-ui/react'

export const StatLabel: React.FC<StatLabelProps> = props => (
  <ChakraStatLabel
    fontWeight="medium"
    isTruncated
    color={useColorModeValue('gray.500', 'gray.400')}
    {...props}
  />
)
