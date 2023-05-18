import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Text,
  Tooltip
} from '@chakra-ui/react'
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
    if (jaenField.defaultValue) {
      console.error(
        `ImageField: using defaultValue is not recommended. If you choose to use it, please be aware that Gatsby will not be able to process the image.`
      )
    }

    const {toast, confirm} = useModals()

    const handleImageChooseClick = (info: {src: string; alt?: string}) => {
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
        id={jaenField.id}
        actions={[
          <Button
            variant="jaenHighlightTooltipText"
            key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
            <Tooltip label={`ID: ${jaenField.id}`} placement="top-start">
              <Text>Image</Text>
            </Tooltip>
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
