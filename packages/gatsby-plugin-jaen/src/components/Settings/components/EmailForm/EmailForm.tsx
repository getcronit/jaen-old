import React from 'react'
import {FaTrash} from 'react-icons/fa'
import {
  UnorderedList,
  ListItem,
  Text,
  HStack,
  Button,
  IconButton,
  Card,
  CardBody,
  Stack,
  StackDivider,
  ButtonGroup,
  Input
} from '@chakra-ui/react'
import {useForm} from 'react-hook-form'

import {FieldGroup} from '../../../../components/shared/FieldGroup'

interface EmailData {
  id: string
  emailAddress: string
  isVerified?: boolean
  isPrimary?: boolean
}

export interface EmailFormData {
  emails: EmailData[]
}

export interface EmailFormProps {
  onSubmit: (data: EmailFormData) => Promise<void>
  defaultValues?: EmailFormData
}

export const EmailForm: React.FC<EmailFormProps> = ({
  onSubmit,
  defaultValues
}) => {
  // In this example, we assume the defaultValues will have an array of email objects
  const {
    handleSubmit,
    formState: {isSubmitting}
  } = useForm<EmailFormData>({
    defaultValues
  })

  const onFormSubmit = handleSubmit(async data => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={onFormSubmit}>
      <FieldGroup title="Emails">
        <Stack spacing="6">
          <Card maxW="full">
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
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
                    <Stack key={email.id}>
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
            </CardBody>
          </Card>

          <Stack spacing="4">
            <Text fontSize="sm" color="muted">
              Add an email address to your account.
            </Text>
            <HStack>
              <Input maxW="xs" type="email" placeholder="Email address" />

              <Button variant="outline">Add</Button>
            </HStack>
          </Stack>
        </Stack>
      </FieldGroup>
    </form>
  )
}
