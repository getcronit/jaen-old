import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Text,
  Tooltip
} from '@chakra-ui/react'
import {useEffect, useMemo, useState} from 'react'
import {FaEraser} from 'react-icons/fa'
import {PhotoProvider, PhotoView} from 'react-photo-view'

import {connectField} from '../../connectors/index'
import {useNotificationsContext} from '../../contexts/notifications'
import {HighlightTooltip} from '../components/HighlightTooltip'
import {DataImage} from './DataImage'
import {ImageFieldValue, ImageProps} from './types'
import {usePageImage} from './usePageImage'

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
  /**
   * When true, the unoptimized image will be rendered after the optimized image.
   * This is useful when you want to display a GIF image.
   *
   * @example
   * ```tsx
   * import {Field} from '@snek-at/jaen'
   *
   * <Field.Image ... overload defaultValue="https://i.giphy.com/media/duzpaTbCUy9Vu/giphy.webp" />
   * ```
   *
   * In this example, the GIF image will be displayed after the optimized image (no GIF).
   */
  overload?: boolean
}

export const ImageField = connectField<ImageFieldValue, ImageFieldProps>(
  ({jaenField, defaultValue, lightbox, lightboxGroup, overload, ...props}) => {
    const {toast, confirm} = useNotificationsContext()

    // const handleImageChooseClick = (info: {src: string; alt?: string}) => {
    //   jaenField.onUpdateValue({
    //     ...jaenField.value,
    //     internalImageUrl: info.src,
    //     alt: info.alt
    //   })

    //   toast({
    //     title: 'Image updated',
    //     description: 'The image has been updated',
    //     status: 'info'
    //   })
    // }

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

    // const handleImageAltSaveClick = (value: string) => {
    //   toast({
    //     title: 'Image description saved',
    //     description: 'The image description has been saved',
    //     status: 'info'
    //   })

    //   jaenField.onUpdateValue({
    //     ...jaenField.value,
    //     alt: value
    //   })
    // }

    const value: ImageFieldValue = {
      ...jaenField.staticValue,
      ...jaenField.value
    }

    const [shouldOverload, setShouldOverload] = useState(false)

    useEffect(() => {
      if (!value.internalImageUrl && defaultValue) {
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
      style: {
        ...jaenField.style,
        width: '100%',
        height: '100%'
      },
      ...props,
      alt: value.alt || props.alt || `${jaenField.name}-image`,
      title: value.title
    }

    const imageElement = useMemo(() => {
      const isLightbox = lightbox && !jaenField.isEditing

      const renderAsDynamic =
        jaenField.value?.internalImageUrl !== undefined || shouldOverload

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
            renderAsDynamic={renderAsDynamic}
            onLoadingComplete={() => {
              if (overload) {
                setShouldOverload(true)
              }
            }}
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
      gatsbyImage,
      shouldOverload
    ])

    console.log('value 2', jaenField.name, value.internalImageUrl)

    return (
      <HighlightTooltip
        id={jaenField.id}
        actions={[
          <Button
            variant="field-highlighter-tooltip-text"
            key={`jaen-highlight-tooltip-text-${jaenField.name}`}>
            <Tooltip label={`ID: ${jaenField.id}`} placement="top-start">
              <Text>Image</Text>
            </Tooltip>
          </Button>,
          <ButtonGroup
            key={`jaen-highlight-tooltip-buttons-${jaenField.name}`}
            size="xs"
            spacing="0.5">
            {/* <ImageChooseButton onClick={handleImageChooseClick} />

            <ImageEditButton
              src={value.internalImageUrl}
              name={jaenField.name}
              onUpdate={({src}) => {
                jaenField.onUpdateValue({
                  ...jaenField.value,
                  internalImageUrl: src
                })
              }}
            /> */}

            <IconButton
              color="brand.500"
              variant="field-highlighter-tooltip"
              icon={<FaEraser />}
              aria-label="Clear content"
              onClick={handleImageClearClick}
            />

            {/* <ImageAltSelector
              value={value?.alt || ''}
              onSave={handleImageAltSaveClick}
            /> */}
          </ButtonGroup>
        ]}
        isEditing={jaenField.isEditing}
        boxSize="full">
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
