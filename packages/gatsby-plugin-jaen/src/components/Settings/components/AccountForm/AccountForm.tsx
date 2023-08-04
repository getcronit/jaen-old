import React from 'react'
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack
} from '@chakra-ui/react'
import {useForm, Controller} from 'react-hook-form'

import {FieldGroup} from '../../../../components/shared/FieldGroup'
import FormMediaChooser from '../../../../containers/form-media-chooser'

export interface AccountFormData {
  firstName: string
  lastName: string
  username: string
  image: string
}

export interface AccountFormProps {
  onSubmit: (data: AccountFormData) => Promise<void>
  defaultValues?: Partial<AccountFormData>
}

export const AccountForm: React.FC<AccountFormProps> = ({
  onSubmit,
  defaultValues
}) => {
  const {
    handleSubmit,
    register,
    control,
    formState: {errors, isSubmitting},
    setValue,
    reset
  } = useForm<AccountFormData>({
    defaultValues
  })

  const onFormSubmit = handleSubmit(async data => {
    // promise to wait for image upload

    await onSubmit(data)

    reset(data)
  })

  return (
    <form onSubmit={onFormSubmit}>
      <FieldGroup title="Account">
        <Stack width="full" spacing="8" maxW="2xl">
          <Stack>
            <FormControl id="firstName" isInvalid={!!errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input
                placeholder=""
                {...register('firstName', {
                  required: 'This field is required'
                })}
              />
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="lastName" isInvalid={!!errors?.lastName}>
              <FormLabel>Last Name</FormLabel>
              <Input
                placeholder=""
                {...register('lastName', {
                  required: 'This field is required'
                })}
              />
              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>

          <FormControl id="username" isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              maxW="xs"
              placeholder=""
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
                    isDirect
                  />
                )
              }}
            />
          </FormControl>

          <ButtonGroup>
            <Button isLoading={isSubmitting} type="submit" variant="outline">
              Update account
            </Button>
          </ButtonGroup>
        </Stack>
      </FieldGroup>
    </form>
  )
}

export default AccountForm
