import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Text,
  Tooltip
} from '@chakra-ui/react'
import {useEffect, useMemo} from 'react'
import {BsEraser} from 'react-icons/bs'
import {PhotoProvider, PhotoView} from 'react-photo-view'

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
  lightbox?: boolean
  /**
   * When true, the image will be displayed in a lightbox along with other images in the same group.
   * Thus it is required to wrap the image in a `PhotoProvider` component.
   *
   * @example
   * ```tsx
   *
   * import {Field, PhotoProvider} from '@snek-at/jaen'
   *
   * <PhotoProvider maskOpacity={0.8}>
   *  <Field.Image ... lightboxGroup />
   *  <Field.Image ... lightboxGroup />
   * </PhotoProvider>
   * ```
   */
  lightboxGroup?: boolean
  defaultValue?: string
}

export const ImageField = connectField<ImageFieldValue, ImageFieldProps>(
  ({jaenField, defaultValue, lightbox, lightboxGroup, ...props}) => {
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
      ...jaenField.value
    }

    useEffect(() => {
      console.log(
        'value',
        jaenField.name,
        value.internalImageUrl,
        defaultValue,
        !value.internalImageUrl && defaultValue
      )

      if (!value.internalImageUrl && defaultValue) {
        console.log('update', defaultValue)
        console.log('current', jaenField.value?.internalImageUrl)
        jaenField.onUpdateValue({
          ...jaenField.value,
          internalImageUrl: defaultValue
        })
      }
    }, [value])

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

    const imageElement = useMemo(() => {
      const isLightbox = lightbox && !jaenField.isEditing

      const dataImage = (
        <Box
          boxSize="full"
          className="jaen-image-wrapper"
          cursor={isLightbox ? 'zoom-in' : 'default'}>
          <DataImage
            imageFieldProps={imageFieldProps}
            internalImageUrl={value.internalImageUrl}
            imageData={gatsbyImage}
            alt={value.alt}
            renderAsDynamic={jaenField.value?.internalImageUrl !== undefined}
          />
        </Box>
      )

      if (isLightbox) {
        const photo = (
          <PhotoView
            src={
              jaenField.value?.internalImageUrl ||
              jaenField.staticValue?.internalImageUrl ||
              undefined
            }>
            {dataImage}
          </PhotoView>
        )

        if (lightboxGroup) {
          return photo
        }

        return <PhotoProvider maskOpacity={0.8}>{photo}</PhotoProvider>
      }

      return dataImage
    }, [
      jaenField,
      lightbox,
      lightboxGroup,
      imageFieldProps,
      value,
      gatsbyImage
    ])

    console.log('value 2', jaenField.name, value.internalImageUrl)

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

        {imageElement}
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:ImageField'
  }
)
