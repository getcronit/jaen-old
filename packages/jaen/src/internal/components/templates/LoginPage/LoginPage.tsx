import {ChevronLeftIcon} from '@chakra-ui/icons'
import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import {navigate, PageProps} from 'gatsby'

import {useAuthentication} from '../../../context/AuthenticationContext.js'

import {withRedux} from '../../../redux/index.js'
import {ThemeProvider} from '../../../styles/ChakraThemeProvider.js'
import {JaenFullLogoWhite} from '../../atoms/icons/JaenLogo/JaenLogo.js'
import {LoginForm} from '../../organisms/index.js'

export interface LoginPageProps extends PageProps {}

export const LoginPage: React.FC<LoginPageProps> = withRedux(props => {
  const {login, demoLogin, redirectToSSO} = useAuthentication()

  return (
    <ThemeProvider>
      <Flex
        w="100%"
        h="100vh"
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
                      Sign-in to your demo account and discover the power of
                      Jaen.
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
                  Powered by{' '}
                  <Link variant="white" href="https://snek.at">
                    Snek
                  </Link>
                </Text>
              </Flex>
            </Flex>
          </Box>
          <Flex
            flex="1 1 0%"
            justifyContent="center"
            alignItems="center"
            align="center">
            <Stack mx="4" maxW="md" w="full" spacing={8}>
              <LoginForm
                onSubmit={async data => {
                  try {
                    await login(
                      data.email,
                      data.password,
                      data.logMeOutAfterwards
                    )

                    return true
                  } catch (error) {
                    console.error(error)
                    return false
                  }
                }}
                onForgotPassword={() => {}}
                onSignUp={() => {}}
                onSSO={() => {
                  void redirectToSSO()
                }}
                onTryDemo={() => {
                  void demoLogin()
                }}
              />
              <Link
                display="flex"
                alignItems="center"
                onClick={() => {
                  // Get history to go back to previous page
                  const from = (props.location.state as any).from

                  // If from is starts with /admin, go back to site

                  const to = from?.startsWith('/admin') ? '/' : from

                  navigate(to)
                }}>
                <ChevronLeftIcon />{' '}
                <Text as="span" fontWeight="medium">
                  Back to site
                </Text>
              </Link>
            </Stack>
          </Flex>
        </Flex>
      </Flex>
    </ThemeProvider>
  )
})
