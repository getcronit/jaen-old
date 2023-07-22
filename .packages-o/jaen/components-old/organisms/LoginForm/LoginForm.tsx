import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  Tooltip,
  VStack
} from '@chakra-ui/react'
import React, {useEffect} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {BsLaptop} from 'react-icons/bs'

interface LoginFormValues {
  email: string
  password: string
  logMeOutAfterwards: boolean
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<boolean>
  onForgotPassword: () => void
  onSignUp: () => void
  onTryDemo: () => void
}

export const LoginForm: React.FC<LoginFormProps> = props => {
  const {
    register,
    handleSubmit,

    control,
    formState: {errors, isSubmitting, isSubmitSuccessful}
  } = useForm<LoginFormValues>()

  const [alert, setAlert] =
    React.useState<{
      status: 'error' | 'success' | 'info'
      message: string | JSX.Element
    } | null>(null)

  const resetAlert = () => {
    setAlert(null)
  }

  const onSubmit = async (values: LoginFormValues) => {
    const success = await props.onSubmit(values)
    if (success) {
      setAlert({
        status: 'success',
        message: 'Login successful. Redirecting...'
      })
    } else {
      setAlert({
        status: 'error',
        message: 'Invalid email or password'
      })
    }
  }

  const onForgotPassword = () => {
    props.onForgotPassword()

    setAlert({
      status: 'info',
      message: (
        <>
          Please <Link href="mailto:contact@snek.at"> contact us </Link>
          to reset your password
        </>
      )
    })
  }

  const onSignUp = () => {
    props.onSignUp()

    setAlert({
      status: 'info',
      message: (
        <>
          Please <Link href="mailto:contact@snek.at"> contact us </Link>
          to create an account for you
        </>
      )
    })
  }

  useEffect(() => {
    const isLoggedOut = window.location.search.includes('loggedOut=true')

    if (isLoggedOut) {
      setAlert({
        status: 'success',
        message: 'You have been logged out'
      })
    }
  }, [])

  return (
    <form
      onSubmit={e => {
        void handleSubmit(onSubmit)(e)
      }}>
      <Stack spacing="4">
        <VStack spacing="6">
          <Heading
            as="h2"
            fontSize={{
              base: '2xl',
              xl: '3xl'
            }}
            fontWeight="semibold"
            lineHeight="3">
            Sign in to your account
          </Heading>
          <HStack>
            <Text>Don&apos;t have an account?</Text>
            <Link onClick={onSignUp}>Sign up</Link>
          </HStack>

          {alert && (
            <Alert status={alert.status}>
              <AlertIcon />
              <Box w="full">{alert.message}</Box>
              <CloseButton
                alignSelf="flex-start"
                position="relative"
                right={-1}
                top={-1}
                onClick={resetAlert}
              />
            </Alert>
          )}
        </VStack>

        <Stack mt="8" spacing="6">
          <Stack spacing="4">
            <FormControl id="email" isInvalid={!(errors.email == null)}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: true
                })}
              />

              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" isInvalid={!(errors.password == null)}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Password
              </FormLabel>
              <Input
                type="password"
                placeholder="********"
                {...register('password', {
                  required: true
                })}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
        </Stack>
        <HStack justifyContent="space-between">
          <Controller
            control={control}
            name="logMeOutAfterwards"
            render={({field: {onChange, onBlur, value, ref}}) => (
              <Checkbox
                onBlur={onBlur}
                onChange={onChange}
                checked={value}
                ref={ref}>
                Log me out after
              </Checkbox>
            )}
          />
          <Link onClick={onForgotPassword}>Forgot password?</Link>
        </HStack>

        <VStack spacing="4">
          <Button
            w="full"
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitSuccessful}>
            Sign in
          </Button>
        </VStack>

        <Flex align="center">
          <Divider />
          <Text padding="2">OR</Text>
          <Divider />
        </Flex>

        <Tooltip
          label={`This will launch a demo of the Jaen instance of ${
            (typeof window !== 'undefined' && window.location.host) || 'none'
          }. You will be able to explore the platform and see how it works, but you won't be able to publish any changes.`}>
          <Button
            w="full"
            colorScheme="gray"
            leftIcon={<BsLaptop fontSize="1.5em" />}
            fontWeight="normal"
            fontSize="sm"
            onClick={props.onTryDemo}>
            Launch demo
          </Button>
        </Tooltip>
      </Stack>
    </form>
  )
}
