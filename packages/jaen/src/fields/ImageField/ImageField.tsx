import {Box, Button, Center, IconButton, Text} from '@chakra-ui/react'
import {GatsbyImage, getSrc} from 'gatsby-plugin-image'
import {
  CSSProperties,
  forwardRef,
  ReactEventHandler,
  useEffect,
  useState
} from 'react'
import {FaImage, FaSlidersH, FaTrashAlt} from 'react-icons/fa'
import {PhotoProvider, PhotoView} from 'react-photo-view'
import {connectField} from '../../connectors'
import {useMediaModal} from '../../contexts/media-modal'
import {
  PageProvider,
  useJaenPageIndex,
  usePageContext
} from '../../contexts/page'
import {JaenPage} from '../../types'
import {HighlightTooltip} from '../components/HighlightTooltip'
import {useImage} from './hooks/use-image'

export interface ImageProps {
  alt?: string
  className?: string
  style?: CSSProperties
  imgClassName?: string
  imgStyle?: CSSProperties
  backgroundColor?: string
  objectFit?: CSSProperties['objectFit']
  objectPosition?: CSSProperties['objectPosition']
  onLoad?: (props: {wasCached: boolean}) => void
  onError?: ReactEventHandler<HTMLImageElement>
  onStartLoad?: (props: {wasCached: boolean}) => void
}

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

export type ImageFieldMediaId = string

export const ImageField = connectField<ImageFieldMediaId, ImageFieldProps>(
  ({
    jaenField,
    lightbox,
    lightboxGroup,
    defaultValue,
    overload,
    ...imageProps
  }) => {
    const isLightbox = lightbox && !jaenField.isEditing

    const mediaId = jaenField.value || jaenField.staticValue

    const {jaenPage} = usePageContext()

    const context = useMediaModal({
      jaenPageId: jaenPage.id,
      onSelect: media => {
        jaenField.onUpdateValue(media.id)
      }
    })

    const handleRemove = () => {
      jaenField.onUpdateValue(undefined)
    }

    const [cmsMediaJaenPage, setCMSMediaJaenPage] = useState<
      {id: string} & Partial<JaenPage>
    >({
      id: 'JaenPage /cms/media/'
    })

    return (
      <HighlightTooltip
        id={jaenField.id || jaenField.name}
        isEditing={jaenField.isEditing}
        boxSize="full"
        minH="20"
        actions={[
          <Button
            variant="field-highlighter-tooltip"
            leftIcon={<FaImage />}
            onClick={() => {
              context.toggleModal({defaultSelected: mediaId})
            }}>
            Image
          </Button>,

          <IconButton
            variant="field-highlighter-tooltip"
            aria-label="Remove"
            icon={<FaTrashAlt />}
            onClick={handleRemove}
          />
        ]}>
        <PageProvider jaenPage={cmsMediaJaenPage}>
          <ImageComponent
            mediaId={mediaId}
            fieldName={jaenField.name}
            onShouldLoadPageData={async () => {
              const data = await fetch('/page-data/cms/media/page-data.json')

              const json = await data.json()

              setCMSMediaJaenPage(json.result.data.jaenPage as JaenPage)
            }}
            imageProps={imageProps}
            lightbox={isLightbox}
            lightboxGroup={lightboxGroup}
          />
        </PageProvider>
      </HighlightTooltip>
    )
  },
  {
    fieldType: 'IMA:ImageField'
  }
)

const ImageComponent = forwardRef<
  HTMLDivElement,
  {
    mediaId?: ImageFieldMediaId
    fieldName: string
    onShouldLoadPageData: () => void
    imageProps?: ImageProps

    lightbox?: boolean
    lightboxGroup?: boolean
  }
>((props, ref) => {
  const image = useImage(props.mediaId || '', props.fieldName)

  useEffect(() => {
    if (!image && props.mediaId) {
      props.onShouldLoadPageData()
    }
  }, [image, props.mediaId])

  if (!image) {
    return (
      <Center
        ref={ref}
        boxSize="full"
        pos={'relative'}
        overflow="hidden"
        style={props.imageProps?.style}>
        <Text color="gray.600" fontSize="sm">
          No image
        </Text>
      </Center>
    )
  }

  let element = (
    <Box
      ref={ref}
      boxSize="full"
      pos={'relative'}
      overflow="hidden"
      cursor={props.lightbox ? 'zoom-in' : 'default'}>
      <GatsbyImage
        image={image.image}
        alt={image.description}
        {...props.imageProps}
        style={{
          ...props.imageProps?.style,
          width: '100%',
          height: '100%'
        }}
      />
    </Box>
  )

  if (props.lightbox) {
    const src = getSrc(image.image)

    element = <PhotoView src={src}>{element}</PhotoView>

    if (!props.lightboxGroup) {
      element = (
        <PhotoProvider maskOpacity={0.8}>
          <PhotoView src={src}>{element}</PhotoView>
        </PhotoProvider>
      )
    }
  }

  return element
})
