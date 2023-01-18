import {Button} from '@chakra-ui/react'
import {useSnekFinder} from '@jaenjs/snek-finder'
import {BsCloudUpload} from 'react-icons/bs'
import {withSnekFinder} from '../../../context/SnekFinder/withSnekFinder.js'

export interface ImageChooseButtonProps {
  onClick: (info: {src: string; alt?: string}) => void
}

export const ImageChooseButton: React.FC<ImageChooseButtonProps> =
  withSnekFinder(props => {
    const finder = useSnekFinder({
      mode: 'selector',
      onSelect: ({src, description}) => {
        props.onClick({
          src,
          alt: description
        })
      }
    })

    return (
      <>
        {finder.finderElement}
        <Button
          leftIcon={<BsCloudUpload />}
          variant="jaenHighlightTooltip"
          onClick={finder.toggleSelector}>
          Choose
        </Button>
      </>
    )
  })
