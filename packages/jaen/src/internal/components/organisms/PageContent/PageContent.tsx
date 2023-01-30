import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Input,
  Stack,
  Tag,
  TagLabel,
  Text,
  Textarea
} from '@chakra-ui/react'
import {useSnekFinder} from '@jaenjs/snek-finder'
import {HiCloudUpload} from '@react-icons/all-files/hi/HiCloudUpload'
import {HiTemplate} from '@react-icons/all-files/hi/HiTemplate'
import * as React from 'react'
import {Controller, useForm} from 'react-hook-form'

import {IFormProps, IJaenTemplate} from '../../../../types.js'
import {dirtyValues} from '../../../../utils/forms/dirtyValues.js'
import {useModals} from '../../../context/Modals/ModalContext.js'
import {ThemeProvider} from '../../../styles/ChakraThemeProvider.js'

export interface ContentValues {
  title: string
  slug: string
  image?: string
  description?: string
  excludedFromIndex?: boolean
}

export interface PageContentProps extends IFormProps<ContentValues> {
  jaenPageId: string
  template: IJaenTemplate | null
  publishedAt: string | undefined
}

/**
 * Component for displaying a page content.
 *
 * It includes Accordion that can be used to expand/collapse the page content.
 */
export const PageContent = (props: PageContentProps) => {
  const {toast} = useModals()

  const [defaultValues, setDefaultValues] = React.useState<ContentValues>(
    props.values
  )

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    formState: {errors, isSubmitting, isDirty, dirtyFields}
  } = useForm<ContentValues>({
    defaultValues
  })

  React.useEffect(() => {
    setDefaultValues(props.values)
    reset(props.values)
  }, [props.values])

  const finder = useSnekFinder({
    mode: 'selector',
    onSelect: ({src}) => {
      setValue('image', src, {
        shouldDirty: true
      })
    }
  })

  const onSubmit = (values: ContentValues) => {
    const vs = {
      ...defaultValues,
      ...values
    }

    props.onSubmit(dirtyValues(dirtyFields, values))

    setDefaultValues(vs)
    reset(vs)

    toast({
      title: 'Saved',
      description: 'Your changes have been saved.',
      status: 'success',
      duration: 5000
    })
  }

  const onReset = () => {
    reset(defaultValues)
  }

  const handleImageUpload = () => {
    finder.toggleSelector()
  }

  const handleImageRemove = () => {
    setValue('image', '', {
      shouldDirty: true
    })
  }

  return (
    <>
      <ThemeProvider>{finder.finderElement}</ThemeProvider>

      <form
        onSubmit={e => {
          void handleSubmit(onSubmit)(e)
        }}
        style={{
          width: '100%'
        }}>
        <Stack boxSize="full" spacing="8">
          <Stack flexGrow="1" overflowY="auto" spacing="4">
            <HStack mb="6">
              {props.template && (
                <Tag my={4} size="md" variant="outline" colorScheme="teal">
                  <Box ml={-1} mr={2}>
                    <HiTemplate />
                  </Box>

                  <TagLabel>{props.template.label}</TagLabel>
                </Tag>
              )}
            </HStack>

            <FormControl isInvalid={!(errors.title == null)}>
              <FormLabel>Title</FormLabel>
              <Input
                // id="title"
                placeholder="Title"
                {...register('title', {
                  required: 'This is required'
                })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            {props.values.slug && props.template && (
              <FormControl mt={4} isInvalid={!(errors.slug == null)}>
                <FormLabel>Slug</FormLabel>
                <Input
                  // id="slug"
                  placeholder="the-slug"
                  disabled={!props.template}
                  {...register('slug', {
                    required: 'This is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        'Only lowercase letters, numbers and hyphens are allowed'
                    },
                    validate: (value: string) => {
                      // return if the form field is not dirty
                      if (!dirtyFields.slug) {
                        return true
                      }

                      const {externalValidation} = props

                      if (externalValidation) {
                        const validation = externalValidation('slug', value)

                        if (validation) {
                          return validation
                        }
                      }

                      return true
                    }
                  })}
                />
                {errors.slug == null && (
                  <FormHelperText>
                    Make sure the slug is unique between siblings.
                  </FormHelperText>
                )}
                <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
              </FormControl>
            )}

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                // id="description"
                placeholder="This is a sample description used for this page."
                {...register('description', {})}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>

              <Controller
                control={control}
                name="image"
                render={({field: {value}}) => (
                  <Stack
                    direction="row"
                    spacing="6"
                    align="center"
                    width="full">
                    <Box boxSize={36} borderRadius="lg" bg="gray.50">
                      <Image
                        borderRadius="lg"
                        boxSize="100%"
                        src={value}
                        fallback={
                          <Center boxSize="100%">
                            <Text color="gray.600" fontSize="sm">
                              No image
                            </Text>
                          </Center>
                        }
                      />
                    </Box>

                    <Box>
                      <HStack spacing="5">
                        <Button
                          leftIcon={<HiCloudUpload />}
                          onClick={handleImageUpload}>
                          Change photo
                        </Button>
                        <Button
                          variant="ghost"
                          colorScheme="red"
                          onClick={handleImageRemove}>
                          Delete
                        </Button>
                      </HStack>
                      <Text fontSize="sm" mt="3" color="gray.500">
                        Upload a photo to represent this page.
                      </Text>
                    </Box>
                  </Stack>
                )}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Settings</FormLabel>
              <Checkbox {...register('excludedFromIndex')}>
                Exclude from index
              </Checkbox>
            </FormControl>
          </Stack>
          <ButtonGroup isDisabled={!isDirty} mt="8">
            <Button isLoading={isSubmitting} type="submit">
              Save
            </Button>
            <Button onClick={onReset} variant="ghost" colorScheme="red">
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      </form>
    </>
  )
}
