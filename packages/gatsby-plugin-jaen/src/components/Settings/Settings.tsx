import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  ListItem,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
  VStack
} from '@chakra-ui/react'

import FormMediaChooser from '../../containers/form-media-chooser'
import {Controller, useForm} from 'react-hook-form'
import {FieldGroup} from '../../components/shared/FieldGroup'
import {FaTrash} from 'react-icons/fa'

interface FormDataType {
  username?: string
  details?: {
    firstName?: string
    lastName?: string
  }
  image?: string
}

export interface SettingsProps {
  data: FormDataType
}

export const Settings: React.FC<SettingsProps> = props => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<FormDataType>({
    defaultValues: props.data
  })

  return (
    <>
      <Stack spacing="4" divider={<StackDivider />} px={{base: '4', md: '10'}}>
        <Heading size="sm">Settings</Heading>

        <FieldGroup title="Account">
          <Stack width="full" spacing="6">
            <HStack>
              <FormControl
                id="firstName"
                isInvalid={!!errors.details?.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input
                  {...register('details.firstName', {
                    required: 'This field is required'
                  })}
                />
                <FormErrorMessage>
                  {errors.details?.firstName &&
                    errors.details.firstName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl id="lastName" isInvalid={!!errors.details?.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  {...register('details.lastName', {
                    required: 'This field is required'
                  })}
                />
                <FormErrorMessage>
                  {errors.details?.lastName && errors.details.lastName.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl id="username" isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                {...register('username', {
                  required: 'This field is required'
                })}
                autoComplete="false"
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="image">
              <FormLabel>Image</FormLabel>

              <Controller
                control={control}
                name="image"
                render={({field: {value}}) => {
                  return (
                    <FormMediaChooser
                      value={value}
                      onChoose={media => {
                        setValue('image', media.url, {
                          shouldDirty: true
                        })
                      }}
                      onRemove={() => {
                        setValue('image', '', {
                          shouldDirty: true
                        })
                      }}
                      description="Upload a profile picture to make your account easier to recognize."
                    />
                  )
                }}
              />
            </FormControl>
          </Stack>
        </FieldGroup>

        <FieldGroup title="Emails">
          <Stack
            width="full"
            // spacing="6"
            borderRadius="lg"
            border="1px solid"
            borderColor="border.emphasized"
            divider={<StackDivider borderColor="border.emphasized" />}>
            {[
              {
                id: 'email-1',
                emailAddress: 'schett@snek.at',
                isVerified: true,
                isPrimary: true
              },
              {
                id: 'email-2',
                emailAddress: 'nicoschett@icloud.com'
              }
            ].map(email => {
              return (
                <Stack key={email.id} px="4" py="4">
                  <HStack justify="space-between">
                    <HStack>
                      <Text fontSize="sm" fontWeight="bold">
                        {email.emailAddress}
                      </Text>
                      -{' '}
                      <Text>
                        {email.isPrimary && (
                          <>
                            -{'  '}
                            <Text fontSize="sm" as="span" color="green.500">
                              Primary
                            </Text>
                          </>
                        )}
                      </Text>
                    </HStack>
                    <IconButton
                      size="xs"
                      aria-label="Delete email address"
                      variant="ghost"
                      color="red.500"
                      icon={<FaTrash />}
                    />
                  </HStack>

                  <UnorderedList>
                    {email.isPrimary && (
                      <ListItem fontSize="sm" color="muted">
                        Primary email addresses are used for account-related
                        communications (e.g. password resets).
                      </ListItem>
                    )}

                    {!email.isVerified && (
                      <ListItem fontSize="sm" color="muted">
                        <HStack>
                          <Text>Unverified</Text>
                          <Button variant="link">
                            Resend verification email
                          </Button>
                        </HStack>
                      </ListItem>
                    )}
                  </UnorderedList>
                </Stack>
              )
            })}
          </Stack>
        </FieldGroup>

        <FieldGroup title="Password">
          <Stack width="full" spacing="6">
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" autoComplete="new-password" />
            </FormControl>

            <FormControl id="confirmPassword">
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" autoComplete="new-password" />
            </FormControl>

            {
              // update password or forgot password link
            }
            <Stack>
              <Text fontSize="sm" color="muted">
                Make sure your password is at least 15 characters OR at least 8
                characters including a number and a lowercase letter.
              </Text>

              <ButtonGroup>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  variant="outline">
                  Update password
                </Button>
                <Button isLoading={isSubmitting} type="submit" variant="link">
                  I forgot my password
                </Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </FieldGroup>
      </Stack>
    </>
  )
}
