import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  Textarea
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {Controller, SubmitHandler, useForm} from 'react-hook-form'
import {FaEdit, FaImage, FaNewspaper} from 'react-icons/fa'
import {FaEyeLowVision} from 'react-icons/fa6'
import slugify from 'slugify'

import {ChooseButton} from '../ChooseButton/ChooseButton'

const texts = {
  heading: {
    create: 'Create a new page',
    edit: 'Edit page'
  },
  lead: {
    create:
      'A page is a collection of fields or blocks that is rendered on a specific URL.',
    edit: 'Edit the fields of your page. Used for SEO and social media.'
  },
  template: {
    create: 'Select a template for your new page',
    edit: 'The template that is used for your page'
  },
  templateHelperText: {
    create: 'This is the template that will be used for your new page.',
    edit: 'If you want to change the template, create a new page and copy the content over.'
  },
  title: {
    create: 'Enter a title for your new page',
    edit: 'The title of your page'
  },
  titleHelperText: {
    create:
      'The title of your new page. The slug will be automatically generated based on the title.',
    edit: 'The title of your page.'
  },
  description: {
    create: 'Enter a description for your new page',
    edit: 'The description of your page'
  },
  descriptionHelperText: {
    create:
      'The description will be used in search engines and social media. It should be 160-165 characters long.',
    edit: 'The description will be used in search engines and social media. It should be 160-165 characters long.'
  },
  parent: {
    create: 'Select a parent page',
    edit: 'The parent page of your page'
  },
  parentHelperText: {
    create: 'This is the parent page of your new page.',
    edit: 'You can move your page to another suitable parent page.'
  },
  image: {
    create: 'Image',
    edit: 'Image'
  },
  imageHelperText: {
    create:
      'Add an image to your page. When not set, the image of the parent page or site will be used.',
    edit: 'The image of your page. When not set, the image of the parent page or site will be used.'
  },
  post: {
    create: 'Post',
    edit: 'Post'
  },
  postHelperText: {
    create: 'Mark this page as a post to add a date and author field.',
    edit: 'Mark this page as a post to add a date and author field.'
  },
  postDate: {
    create: 'Enter a date for your new page',
    edit: 'The date of your page'
  },
  postDateHelperText: {
    create: 'The date will be used to sort your posts.',
    edit: 'The date will be used to sort your posts.'
  },
  postAuthor: {
    create: 'Enter an author for your new page',
    edit: 'The author of your page'
  },
  postAuthorHelperText: {
    create: 'This will be used to display the author of the post.',
    edit: 'This will be used to display the author of the post.'
  },
  postCategory: {
    create: 'Enter a category for your new page',
    edit: 'The category of your page'
  },
  postCategoryHelperText: {
    create: 'The category will be used to sort your posts.',
    edit: 'The category will be used to sort your posts.'
  },
  excludeFromIndex: {
    create: 'Exclude from index',
    edit: 'Exclude from index'
  },
  excludeFromIndexHelperText: {
    create:
      'Exclude this page from all index fields (e.g. places where pages are listed)',
    edit: 'Exclude this page from all index fields (e.g. places where pages are listed)'
  }
}

interface FormValues {
  title: string
  slug: string
  description: string
  parent: string
  template: string
  blogPost?: {
    isBlogPost?: boolean
    date?: string
    author?: string
    category?: string
  }
  image?: {
    useImage?: boolean
    src?: string
  }
  isExcludedFromIndex?: boolean
}

export interface PageContentFormProps {
  onSubmit: (data: FormValues) => void
  values?: Partial<FormValues>
  mode?: 'create' | 'edit'
}

export const PageContentForm: React.FC<PageContentFormProps> = ({
  mode = 'create',
  ...props
}) => {
  const {
    handleSubmit,
    watch,
    register,
    getValues,
    setValue,
    reset,
    control,
    formState: {errors}
  } = useForm<FormValues>({
    defaultValues: props.values
  })

  const [isEditFormLocked, setIsEditFormLocked] = useState<boolean>(true)

  const handleReset = () => {
    // Reset the form to the default values
    reset(props.values)

    // Lock the form
    setIsEditFormLocked(true)
  }

  const onSubmit: SubmitHandler<FormValues> = data => {
    console.log(data)
  }

  const title = watch('title', '') // Get the value of the 'title' field

  useEffect(() => {
    // only run when mode is create
    if (mode !== 'create') {
      return
    }

    const slug = slugify(title, {lower: true}) // Generate the slug from the title
    setValue('slug', slug) // Set the value of the 'slug' field using setValue from react-hook-form
  }, [mode, title, setValue])

  if (mode === 'edit' && isEditFormLocked) {
    return (
      <Stack w="full" divider={<StackDivider />} spacing="4">
        <Heading as="h1" size="sm">
          Page
        </Heading>

        <HStack spacing="4">
          {props.values?.image?.src ? (
            <Image
              src={props.values?.image?.src}
              boxSize={36}
              borderRadius="lg"
              fallback={<Skeleton boxSize={36} borderRadius="lg" />}
            />
          ) : (
            <Center boxSize={36} borderRadius="lg" bg="bg.subtle">
              <FaImage fontSize="2xl" />
            </Center>
          )}

          <Stack>
            <Heading as="h2" size="xs">
              {props.values?.title}
            </Heading>

            <Text fontSize="sm" color="fg.muted">
              {props.values?.description}
            </Text>
          </Stack>
        </HStack>
        <HStack justifyContent="end">
          <Button
            variant="outline"
            leftIcon={<FaEdit />}
            onClick={() => {
              setIsEditFormLocked(false)
            }}>
            Edit page
          </Button>
        </HStack>
      </Stack>
    )
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()

        void handleSubmit(onSubmit)()
      }}>
      <Stack w="full" divider={<StackDivider />} spacing="4">
        <Stack>
          <Heading as="h1" size="sm">
            {texts.heading[mode]}
          </Heading>

          <Text fontSize="sm" color="fg.muted">
            {texts.lead[mode]}
          </Text>
        </Stack>

        <FormControl as="fieldset" isRequired isInvalid={!!errors.template}>
          <FormLabel as="legend">{texts.template[mode]}</FormLabel>
          {mode === 'create' ? (
            <Controller
              control={control}
              name="template"
              rules={{
                required: true
              }}
              render={({field}) => {
                return (
                  <ChooseButton
                    onChange={field.onChange}
                    items={{
                      BlogPost: {
                        label: 'Post'
                      },
                      GridPage: {
                        label: 'Grid'
                      }
                    }}
                  />
                )
              }}
            />
          ) : (
            <Button variant="outline" bgColor="bg.subtle" isDisabled>
              {props.values?.template} (cannot be changed)
            </Button>
          )}
          <FormHelperText>{texts.templateHelperText[mode]}</FormHelperText>
        </FormControl>

        <Stack spacing="4">
          <FormControl
            as="fieldset"
            isRequired
            isInvalid={!!errors.title || !!errors.slug}>
            <FormLabel as="legend">{texts.title[mode]}</FormLabel>
            <Grid templateColumns="70% 30%" gap="2">
              <Input
                {...register('title', {required: true})}
                placeholder="Title"
              />
              <Input
                {...register('slug', {required: true})}
                placeholder="slug"
              />
            </Grid>
            <FormHelperText>{texts.titleHelperText[mode]}</FormHelperText>
          </FormControl>

          <FormControl
            as="fieldset"
            isRequired
            isInvalid={!!errors.description}>
            <FormLabel as="legend">{texts.description[mode]}</FormLabel>
            <Textarea
              {...register('description', {required: true})}
              placeholder="Description"
            />
            <FormHelperText as={HStack} justifyContent="space-between">
              <Text>{texts.descriptionHelperText[mode]}</Text>
              <Text>{watch('description')?.length || 0}</Text>
            </FormHelperText>
          </FormControl>
        </Stack>

        <FormControl as="fieldset" isInvalid={!!errors.parent} isRequired>
          <FormLabel as="legend">{texts.parent[mode]}</FormLabel>

          <Controller
            control={control}
            name="parent"
            rules={{
              required: true
            }}
            render={({field}) => {
              return (
                <ChooseButton
                  onChange={field.onChange}
                  items={{
                    HomePage: {
                      label: 'Home'
                    },
                    AboutPage: {
                      label: 'About'
                    }
                  }}
                />
              )
            }}
          />

          <FormHelperText>{texts.parentHelperText[mode]}</FormHelperText>
        </FormControl>

        <FormControl as="fieldset">
          <Stack spacing="4">
            <Checkbox
              {...register('image.useImage', {
                required: false
              })}>
              <HStack>
                <Icon as={FaImage} color="brand.500" />
                <Stack spacing="0.5">
                  <Text fontWeight="semibold">{texts.image[mode]}</Text>
                  <Text fontSize="sm" color="fg.muted">
                    {texts.imageHelperText[mode]}
                  </Text>
                </Stack>
              </HStack>
            </Checkbox>

            <Box
              display={
                // If the checkbox is checked, display the fields
                watch('image.useImage') ? 'flex' : 'none'
              }>
              <Controller // Controller is used to integrate external inputs into the react-hook-form
                control={control}
                name="image.src"
                render={({field}) => {
                  return (
                    <HStack spacing="4">
                      {!field.value ? (
                        <Center boxSize={36} borderRadius="lg" bg="bg.subtle">
                          <FaImage fontSize="2xl" />
                        </Center>
                      ) : (
                        <Image
                          src={field.value}
                          boxSize={36}
                          borderRadius="lg"
                          fallback={<Skeleton boxSize={36} borderRadius="lg" />}
                        />
                      )}

                      <ButtonGroup>
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Open the media library

                            // set example image
                            field.onChange('https://picsum.photos/200/300')
                          }}>
                          Choose image
                        </Button>
                        <Button
                          // visibility={field.value ? 'visible' : 'hidden'}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => {
                            field.onChange(null)
                          }}>
                          Remove
                        </Button>
                      </ButtonGroup>
                    </HStack>
                  )
                }}
              />
            </Box>
          </Stack>
        </FormControl>

        <FormControl
          as="fieldset"
          isInvalid={!!errors.blogPost?.date || !!errors.blogPost?.author}>
          <Stack spacing="4">
            <Checkbox
              {...register('blogPost.isBlogPost', {
                required: false
              })}>
              <HStack>
                <Icon as={FaNewspaper} color="brand.500" />
                <Stack spacing="0.5">
                  <Text fontWeight="semibold">{texts.post[mode]}</Text>
                  <Text fontSize="sm" color="fg.muted">
                    {texts.postHelperText[mode]}
                  </Text>
                </Stack>
              </HStack>
            </Checkbox>

            <Stack
              spacing="4"
              display={
                // If the checkbox is checked, display the fields
                watch('blogPost.isBlogPost') ? 'flex' : 'none'
              }>
              <FormControl
                as="fieldset"
                isInvalid={!!errors.blogPost?.date}
                isRequired={getValues('blogPost.isBlogPost')}
                isDisabled={!getValues('blogPost.isBlogPost')}>
                <FormLabel as="legend">{texts.postDate[mode]}</FormLabel>
                <Input
                  {...register('blogPost.date', {
                    validate: value => {
                      if (!value && getValues('blogPost.isBlogPost')) {
                        return 'Date is required for blog posts'
                      }

                      return true
                    }
                  })}
                  type="date"
                />
                <FormHelperText>
                  {texts.postDateHelperText[mode]}
                </FormHelperText>
              </FormControl>

              <FormControl
                as="fieldset"
                isInvalid={!!errors.blogPost?.author}
                isRequired={getValues('blogPost.isBlogPost')}
                isDisabled={!getValues('blogPost.isBlogPost')}>
                <FormLabel as="legend">{texts.postAuthor[mode]}</FormLabel>
                <Input
                  {...register('blogPost.author', {
                    validate: value => {
                      if (!value && getValues('blogPost.isBlogPost')) {
                        return 'Author is required for blog posts'
                      }

                      return true
                    }
                  })}
                  placeholder="Author"
                />
                <FormHelperText>
                  {texts.postAuthorHelperText[mode]}
                </FormHelperText>
              </FormControl>

              <FormControl
                as="fieldset"
                isInvalid={!!errors.blogPost?.category}
                isDisabled={!getValues('blogPost.isBlogPost')}>
                <FormLabel as="legend">{texts.postCategory[mode]}</FormLabel>
                <Input
                  {...register('blogPost.category')}
                  placeholder="Category"
                />
                <FormHelperText>
                  {texts.postCategoryHelperText[mode]}
                </FormHelperText>
              </FormControl>
            </Stack>
          </Stack>
        </FormControl>

        <FormControl as="fieldset" isInvalid={!!errors.isExcludedFromIndex}>
          <Checkbox
            {...register('isExcludedFromIndex', {
              required: false
            })}>
            <HStack>
              <Icon as={FaEyeLowVision} color="brand.500" />
              <Stack spacing="0.5">
                <Text fontWeight="semibold">
                  {texts.excludeFromIndex[mode]}
                </Text>
                <Text fontSize="sm" color="fg.muted">
                  {texts.excludeFromIndexHelperText[mode]}
                </Text>
              </Stack>
            </HStack>
          </Checkbox>
        </FormControl>

        <HStack justifyContent="right">
          <ButtonGroup>
            {mode === 'edit' && (
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {mode === 'create' ? 'Create page' : 'Save page'}
            </Button>
          </ButtonGroup>
        </HStack>
      </Stack>
    </form>
  )
}
