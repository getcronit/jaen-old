import {ArrowBackIcon} from '@chakra-ui/icons'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text
} from '@chakra-ui/react'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {JaenFullLogo, JaenLogo} from '../shared/JaenLogo/JaenLogo.js'
import {Link} from '../shared/Link/Link.js'
import {PasswordField} from './components/PasswordField.js'

export interface JaenLoginProps {
  onSignIn: (values: FormData) => Promise<void>
  goBackPath: string
  forgotPasswordPath: string
  signUpPath: string
}

interface FormData {
  login: string
  password: string
  logMeOutAfterwards: boolean
}

export const JaenLogin: React.FC<JaenLoginProps> = props => {
  const {
    handleSubmit,
    register,
    formState: {errors}
  } = useForm<FormData>()

  const [alert, setAlert] =
    useState<{
      status: 'error' | 'success' | 'info'
      message: string | JSX.Element
      description?: string
    } | null>(null)

  const resetAlert = () => {
    setAlert(null)
  }

  const onSubmit = async (data: FormData) => {
    console.log(data)

    try {
      await props.onSignIn(data)
    } catch (e) {
      setAlert({
        status: 'error',
        message: 'Unable to sign in',
        description: e.message
      })
    }
  }

  return (
    <Box
      pos="fixed"
      top="0"
      left="0"
      h="100dvh"
      w="full"
      bgColor="translucent.bgColor"
      backdropFilter="blur(8px) saturate(180%) contrast(46%) brightness(120%)">
      <Container
        maxW="lg"
        py={{base: '12', md: '24'}}
        px={{base: '0', sm: '8'}}>
        <Stack spacing="8">
          <Stack spacing="6">
            <HStack justify="center">
              <Link
                as={Button}
                variant="outline"
                leftIcon={<ArrowBackIcon />}
                to={props.goBackPath}>
                Back to website
              </Link>
            </HStack>
            <HStack justify="center">
              <JaenLogo height="12" width="auto" />
            </HStack>
            <Stack spacing={{base: '2', md: '3'}} textAlign="center">
              <Heading size={{base: 'xs', md: 'sm'}}>
                Log in to your account
              </Heading>
              <Text color="fg.muted">
                Don&apos;t have an account?{' '}
                <Link to={props.signUpPath}>Sign up</Link>
              </Text>
            </Stack>
          </Stack>

          {alert && (
            <Alert status={alert.status}>
              <AlertIcon />
              <Box>
                <AlertTitle>{alert.message}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Box>
              <CloseButton
                alignSelf="flex-start"
                position="relative"
                right={-1}
                top={-1}
                onClick={resetAlert}
              />
            </Alert>
          )}

          <Box
            as="form"
            onSubmit={() => {
              void handleSubmit(onSubmit)()
            }}
            py={{base: '0', sm: '8'}}
            px={{base: '4', sm: '10'}}
            bgColor="body.bgColor"
            boxShadow={{base: 'none', sm: 'md'}}
            borderRadius={{base: 'none', sm: 'xl'}}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl isInvalid={!!errors.login}>
                  <FormLabel htmlFor="login">
                    Username or email address
                  </FormLabel>
                  <Input id="login" {...register('login', {required: true})} />
                  <FormErrorMessage>
                    {errors.login && 'Username or email address'}
                  </FormErrorMessage>
                </FormControl>
                <PasswordField
                  {...register('password', {required: true})}
                  isInvalid={!!errors.password?.message}
                />
              </Stack>
              <HStack justify="space-between">
                <Checkbox
                  id="logMeOutAfterwards"
                  colorScheme="pink"
                  {...register('logMeOutAfterwards')}>
                  Log me out after
                </Checkbox>
                <Link size="sm" to={props.forgotPasswordPath}>
                  Forgot password?
                </Link>
              </HStack>
              <Stack spacing="6">
                <Button type="submit">Sign in</Button>
                {/* <HStack>
                <Divider />
                <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                  powered by
                </Text>
                <Divider />
                <OAuthButtonGroup />
              </HStack> */}
              </Stack>
            </Stack>
          </Box>
          <JaenFullLogo height="12" width="auto" />
        </Stack>
      </Container>
    </Box>
  )
}
