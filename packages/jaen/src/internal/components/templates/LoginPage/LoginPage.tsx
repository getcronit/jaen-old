import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Text
} from '@chakra-ui/react'
import {useAuth} from '../../../hooks/auth/useAuth.js'
import {withRedux} from '../../../redux/index.js'
import {JaenFullLogoWhite} from '../../atoms/icons/JaenLogo/JaenLogo.js'
import {LoginForm} from '../../organisms/index.js'

export interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = withRedux(() => {
  const {demoLogin, login} = useAuth()

  return (
    <Flex
      w="100%"
      minH="100vh"
      bgGradient={{
        lg: 'linear(to-r, pink.500 50%, white 50%)'
      }}>
      <Flex w="full" maxW="8xl" mx="auto">
        <Box flex="1 1 0%" display={{base: 'none', lg: 'block'}}>
          <Flex
            flexDirection="column"
            px={{base: 4, lg: 8}}
            h="full"
            color="white">
            <Flex align="center" alignItems="center" h="24">
              <JaenFullLogoWhite h="full" w="auto" />
            </Flex>
            <Flex flex="1 1 0%" align="center" alignItems="center">
              <Stack spacing="8">
                <Stack spacing="4">
                  <Heading
                    as="h2"
                    fontSize={{
                      lg: '5xl',
                      xl: '6xl'
                    }}
                    fontWeight="semibold"
                    letterSpacing="tight"
                    lineHeight="4.5rem">
                    Start editing to see some magic happen!
                  </Heading>
                  <Text mt="6" fontSize="lg" maxW="md" fontWeight="medium">
                    Sign-in to your demo account and discover the power of Jaen.
                  </Text>
                </Stack>
                <HStack mt="8">
                  <AvatarGroup>
                    <Avatar bg="red.500" />
                    <Avatar bg="teal.500" />
                    <Avatar bg="teal.500" />
                  </AvatarGroup>
                  <Text fontWeight="medium">Join with your business</Text>
                </HStack>
              </Stack>
            </Flex>
            <Flex align="center" alignItems="center" h="24">
              <Text fontWeight="medium" fontSize="sm">
                Powered by Snek
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Flex
          flex="1 1 0%"
          justifyContent="center"
          alignItems="center"
          align="center">
          <Box py="48" mx="auto" maxW="md" w="full">
            <LoginForm
              onSubmit={async data => {
                const res = await login(
                  {
                    email: data.email,
                    password: data.password
                  },
                  {
                    logMeOutAfterwards: data.logMeOutAfterwards
                  }
                )

                return res
              }}
              onForgotPassword={() => {}}
              onSignUp={() => {}}
              onSSO={() => {}}
              onTryDemo={() => {
                demoLogin()
              }}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
})
