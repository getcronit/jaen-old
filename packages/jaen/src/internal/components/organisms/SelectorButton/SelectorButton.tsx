import {Box, Flex, IconButton, VStack} from '@chakra-ui/react'
import React, {useRef, useState} from 'react'

export interface SelectorButtonProps {
  icon: JSX.Element
  children: React.ReactNode
}

export const SelectorButton: React.FC<SelectorButtonProps> = props => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const canClose = useRef(false)

  const handleMouseLeave = () => {
    canClose.current = true
    setTimeout(() => {
      if (canClose.current) {
        setIsOpen(false)
      }
    }, 1000)
  }

  const handleMouseEnter = () => {
    canClose.current = false
  }

  return (
    <Flex
      pos="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <IconButton
        variant="jaenHighlightTooltip"
        ml={0.5}
        icon={props.icon}
        aria-label="Add"
        onClick={toggleOpen}
      />
      {isOpen && (
        <Box position="absolute" top="6" left="0" zIndex="popover" p="2">
          <VStack
            p="3"
            rounded="xl"
            bg="white"
            maxW="300px"
            shadow="lg"
            border="1px"
            borderColor="gray.100">
            {props.children}
          </VStack>
        </Box>
      )}
    </Flex>
  )
}
