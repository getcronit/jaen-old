import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'
import * as React from 'react'
import {Controller, useForm} from 'react-hook-form'

import {IFormProps, IJaenTemplate} from '../../../../types.js'
import {useModals} from '../../../context/Modals/ModalContext.js'

interface TemplateSelectorProps {
  selectedTemplate: string
  templates: Array<Omit<IJaenTemplate, 'children'>>
  onSelect: (templateName: string) => void
}

const TemplateSelector = ({
  selectedTemplate,
  templates,
  onSelect
}: TemplateSelectorProps) => {
  // const [selectedTemplate, setSelectedTemplate] = React.useState<string>(
  //   props.selectedTemplate
  // )

  const handleSelect = (templateName: string) => {
    let newSelectedTemplate = templateName

    // Clear selection if the same template is selected
    if (newSelectedTemplate === selectedTemplate) {
      newSelectedTemplate = ''
    }

    // setSelectedTemplate(newSelectedTemplate)
    onSelect(newSelectedTemplate)
  }

  if (templates.length === 0) {
    return (
      <Text size="xs" color="gray.400">
        No templates found.
      </Text>
    )
  }

  return (
    <>
      {templates.map(({name, label}, key) => (
        <Button
          key={key}
          variant="outline"
          colorScheme={
            selectedTemplate && selectedTemplate === name ? 'pink' : 'gray'
          }
          mr={2}
          onClick={() => {
            handleSelect(name)
          }}>
          {label}
        </Button>
      ))}
    </>
  )
}

export interface CreateValues {
  slug: string
  title: string
  template: Omit<IJaenTemplate, 'children'>
}

export interface PageCreatorProps extends IFormProps<CreateValues> {
  templates: TemplateSelectorProps['templates']
  isTemplatesLoading: boolean
  finalFocusRef: React.RefObject<any>
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal to create a new page.
 * Renders a list of templates to choose from.
 */
export const PageCreator = ({
  templates,
  finalFocusRef,
  isOpen,
  isTemplatesLoading,
  onClose,
  ...form
}: PageCreatorProps) => {
  const initialFocusRef = React.useRef<any>()

  const {toast} = useModals()

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: {errors, isSubmitting, isDirty}
  } = useForm<CreateValues>({
    defaultValues: form.values
  })

  const onSubmit = (values: CreateValues) => {
    // update template object with the full template object
    values.template = templates.find(
      e => e.name === values.template.name
    ) as IJaenTemplate

    form.onSubmit(values)

    reset()

    toast({
      title: 'Page created',
      description: `Page "${values.title}" created`,
      status: 'success'
    })
  }

  const onCancel = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={e => {
            void handleSubmit(onSubmit)(e)
          }}>
          <ModalHeader>Create a page</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!(errors.title == null)}>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Title"
                {...register('title', {
                  required: 'This is required'
                })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!(errors.slug == null)}>
              <FormLabel>Slug</FormLabel>
              <Input
                // id="slug"
                placeholder="the-slug"
                {...register('slug', {
                  required: 'This is required',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message:
                      'Only lowercase letters, numbers and hyphens are allowed'
                  },
                  validate: (value: string) => {
                    const {externalValidation} = form

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
            <FormControl mt={4} isInvalid={!(errors.template?.name == null)}>
              <FormLabel>Template</FormLabel>
              <Controller
                control={control}
                name="template.name"
                rules={{required: 'Please select a template'}}
                render={({field: {value, onChange}}) => (
                  <>
                    {isTemplatesLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <TemplateSelector
                        selectedTemplate={value}
                        templates={templates}
                        onSelect={templateName => {
                          onChange(templateName)
                        }}
                      />
                    )}
                  </>
                )}
              />
              {errors.template?.name == null && (
                <FormHelperText>
                  Select the template to use for this page.
                </FormHelperText>
              )}
              <FormErrorMessage>
                {errors.template?.name?.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onCancel} variant="ghost">
              Cancel
            </Button>
            <Button
              ml={3}
              isLoading={isSubmitting}
              disabled={!isDirty}
              type="submit">
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
