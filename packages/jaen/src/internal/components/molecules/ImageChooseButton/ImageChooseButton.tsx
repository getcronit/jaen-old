import {Box, Button, theme} from '@chakra-ui/react'
import {useSnekFinder} from '@snek-at/snek-finder'
import {BsCloudUpload} from 'react-icons/bs'
import {withSnekFinder} from '../../../context/SnekFinder/withSnekFinder.js'
import {ThemeProvider} from '../../../styles/ChakraThemeProvider.js'

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
        <ThemeProvider theme={theme}>
          <Box maxW="container.xl">{finder.finderElement}</Box>
        </ThemeProvider>
        <Button
          leftIcon={<BsCloudUpload />}
          variant="jaenHighlightTooltip"
          onClick={finder.toggleSelector}>
          Choose
        </Button>
      </>
    )
  })
