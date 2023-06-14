import {Box, Flex, Icon, IconButton, IconButtonProps} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {FaBars} from 'react-icons/fa'
import {TuneSelector, TuneSelectorProps} from '../../molecules/index.js'

export interface TuneSelectorButtonProps extends IconButtonProps {
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
        icon={<Icon as={FaBars} />}
        onClick={toggleOpen}
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
