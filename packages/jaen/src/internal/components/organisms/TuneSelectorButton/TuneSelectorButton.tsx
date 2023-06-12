import {DragHandleIcon} from '@chakra-ui/icons'
import {Box, Flex, IconButton, IconButtonProps} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {TuneSelector, TuneSelectorProps} from '../../molecules/index.js'

export interface TuneSelectorButtonProps
  extends Omit<IconButtonProps, 'aria-label'> {
  tunes: TuneSelectorProps['tunes']
  onTune?: TuneSelectorProps['onTune']
  tuneProps?: TuneSelectorProps['tuneProps']
}

export const TuneSelectorButton: React.FC<TuneSelectorButtonProps> = ({
  tunes,
  onTune = () => {},
  tuneProps = {},
  ...iconButtonProps
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    console.log('TuneSelectorButton')
  }, [])

  return (
    <Flex pos="relative">
      <IconButton
        variant="jaenHighlightTooltip"
        icon={<DragHandleIcon />}
        onClick={toggleOpen}
        aria-label="Tune"
        {...iconButtonProps}
      />
      {isOpen && (
        <Box position="absolute" top="6" left="0" zIndex="popover" p="2">
          <TuneSelector
            tunes={tunes}
            onTune={onTune}
            tuneProps={tuneProps}
            onClose={() => {
              setIsOpen(false)
            }}
          />
        </Box>
      )}
    </Flex>
  )
}
