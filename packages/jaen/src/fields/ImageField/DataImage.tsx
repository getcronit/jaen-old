import {Center, Text} from '@chakra-ui/react'
import {GatsbyImage, IGatsbyImageData} from 'gatsby-plugin-image'
import {ImageProps} from './types.js'

export interface DataImageProps {
  imageFieldProps: ImageProps & {
    alt: string
  }
  imageData: IGatsbyImageData | undefined
  alt: string | undefined
  internalImageUrl: string | null | undefined
  renderAsDynamic?: boolean
}

export const DataImage: React.FC<DataImageProps> = ({
  imageFieldProps,
  imageData,
  internalImageUrl,
  renderAsDynamic = false
}) => {
  let imageElement

  const gatsbyImageDynamic = {
    placeholder: undefined,
    layout: 'constained',
    images: {
      fallback: {
        src: internalImageUrl
      }
    }
  }

  if (internalImageUrl && renderAsDynamic) {
    imageElement = (
      <GatsbyImage
        {...imageFieldProps}
        // @ts-expect-error
        image={gatsbyImageDynamic}
        imgStyle={{
          ...imageFieldProps.imgStyle,
          position: 'static'
        }}
      />
    )
  } else if (imageData) {
    imageElement = <GatsbyImage {...imageFieldProps} image={imageData} />
  } else {
    imageElement = (
      <Center style={imageFieldProps.style}>
        <Text color="gray.600" fontSize="sm">
          No image
        </Text>
      </Center>
    )
  }

  return imageElement
}
