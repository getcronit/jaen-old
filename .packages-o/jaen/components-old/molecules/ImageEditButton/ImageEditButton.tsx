import {EditIcon} from '@chakra-ui/icons'
import {Button, theme} from '@chakra-ui/react'
import {useSnekFinder} from '@snek-at/snek-finder'
import {withSnekFinder} from '../../../context/SnekFinder/withSnekFinder.js'
import {ThemeProvider} from '../../../styles/ChakraThemeProvider.js'

export interface ImageEditButtonProps {
  src?: string | null
  name: string
  onUpdate: (info: {src: string}) => void
}

export const ImageEditButton: React.FC<ImageEditButtonProps> = withSnekFinder(
  props => {
    const finder = useSnekFinder({
      mode: 'editor',
      onSnekStudioUpdate: (_, src) => {
        props.onUpdate({
          src
        })
      }
    })

    const isDisabled = !props.src

    const toggleSnekStudio = () => {
      if (isDisabled) return

      finder.toggleSnekStudio(props.src!, props.name)
    }

    return (
      <>
        <ThemeProvider theme={theme}>{finder.finderElement}</ThemeProvider>
        <Button
          aria-label="Edit Image"
          isDisabled={isDisabled}
          leftIcon={<EditIcon />}
          variant="jaenHighlightTooltip"
          onClick={toggleSnekStudio}>
          Edit
        </Button>
      </>
    )
  }
)
