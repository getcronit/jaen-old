import {Box, Button, ButtonGroup, IconButton, Text} from '@chakra-ui/react'
import {BsEraser} from 'react-icons/bs'

import {connectField} from '../../connectors/index.js'
import {
  HighlightTooltip,
  ImageAltSelector,
  ImageChooseButton
} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'
import {DataImage} from './DataImage.js'
import {ImageFieldValue, ImageProps} from './types.js'
import {usePageImage} from './usePageImage.js'

export interface ImageFieldProps extends ImageProps {
  // onLoad?: (props: {wasCached: boolean}) => void
  // onError?: ReactEventHandler<HTMLImageElement>
  // onStartLoad?: (props: {wasCached: boolean}) => void
}

export const ImageField = connectField<
  ImageFieldValue,
  string | undefined,
  ImageFieldProps
>(
  ({jaenField, ...props}) => {
    console.log(jaenField)

    if (jaenField.defaultValue) {
      console.error(
        `ImageField: using defaultValue is not recommended. If you choose to use it, please be aware that Gatsby will not be able to process the image.`
      )
    }

    const {toast, confirm} = useModals()

    const handleImageChooseClick = (info: {src: string; alt?: string}) => {
      console.log('handleImageChooseClick')

      jaenField.onUpdateValue({
        ...jaenField.value,
        internalImageUrl: info.src,
        alt: info.alt
      })

      toast({
        title: 'Image updated',
        description: 'The image has been updated',
        status: 'info'
      })
    }

    const handleImageClearClick = () => {
      console.log('handleImageClearClick')

      const updateWhenConfirmed = async () => {
        const confirmed = await confirm(
          'Are you sure you want to clear the image?'
        )

        if (confirmed) {
          jaenField.onUpdateValue({
            internalImageUrl: null
          })

          toast({
            title: 'Image cleared',
            description: 'The image has been cleared',
            status: 'info'
          })
        }
      }

      void updateWhenConfirmed()
    }

    const handleImageAltSaveClick = (value: string) => {
      console.log('handleImageAltSaveClick')
      toast({
        title: 'Image description saved',
        description: 'The image description has been saved',
        status: 'info'
      })

      jaenField.onUpdateValue({
        ...jaenField.value,
        alt: value
      })
    }

    const value: ImageFieldValue = {
      ...jaenField.staticValue,
      ...jaenField.value,
      internalImageUrl: jaenField.value?.internalImageUrl
    }

    const gatsbyImage = usePageImage({
      id: jaenField?.staticValue?.imageId as string,
      byFieldName: jaenField.name
    })

    console.log(value, gatsbyImage)

    const imageFieldProps = {
      alt: value.alt || 'Image',
      title: value.title || 'Image',
      style: {
        ...jaenField.style,
        width: '100%',
        height: '100%'
      },
      ...props
    }

    return (
      <HighlightTooltip
        actions={[
          <Button
            variant="jaenHighlightTooltipText"
            key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
            <Text as="span" noOfLines={1}>
              Image {jaenField.name}
            </Text>
          </Button>,
          <ButtonGroup
            key={`jaen-highlight-tooltip-buttons-${jaenField.name}`}
            size="xs"
            spacing="0.5">
            <ImageChooseButton onClick={handleImageChooseClick} />

            <IconButton
              variant="jaenHighlightTooltip"
              icon={<BsEraser />}
              aria-label="Clear content"
              onClick={handleImageClearClick}
            />

            <ImageAltSelector
              value={value?.alt || ''}
              onSave={handleImageAltSaveClick}
            />
          </ButtonGroup>
        ]}
        isEditing={jaenField.isEditing}>
        {
          // The box is needed because the highlight tooltip will not work if the image is the only child
        }
        <Box boxSize="full" className="jaen-image-wrapper">
          <DataImage
            imageFieldProps={imageFieldProps}
            internalImageUrl={value.internalImageUrl}
            defaultImageUrl={jaenField.defaultValue}
            imageData={gatsbyImage}
            alt={value.alt}
          />
        </Box>
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:ImageField'
  }
)
