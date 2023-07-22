import {
  StatNumber as ChakraStatNumber,
  StatNumberProps,
  useColorModeValue
} from '@chakra-ui/react'

export const StatNumber: React.FC<StatNumberProps> = props => (
  <ChakraStatNumber
    fontSize="3xl"
    fontWeight="medium"
    color={useColorModeValue('gray.900', 'white')}
    {...props}
  />
)
