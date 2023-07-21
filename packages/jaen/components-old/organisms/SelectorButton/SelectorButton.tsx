import {Box, ButtonProps, Flex, IconButton, VStack} from '@chakra-ui/react'
import React, {useRef, useState} from 'react'

export interface SelectorButtonProps extends Omit<ButtonProps, 'children'> {
  icon: JSX.Element
  children:
    | React.ReactNode
    | ((props: {onClose: () => void}) => React.ReactNode)
}

export const SelectorButton: React.FC<SelectorButtonProps> = ({
  icon,
  children: childrenProp,
  ...props
}) => {
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

  const children =
    typeof childrenProp === 'function'
      ? childrenProp({
          onClose: () => {
            setIsOpen(false)
          }
        })
      : childrenProp

  return (
    <Flex
      pos="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <IconButton
        variant="jaenHighlightTooltip"
        size="xs"
        icon={icon}
        aria-label="Add"
        onClick={toggleOpen}
        {...props}
      />
      {isOpen && (
        <Box position="absolute" top="6" left="0" zIndex="popover" p="2">
          <VStack
            p="3"
            rounded="xl"
            bg="white"
            shadow="lg"
            border="1px"
            borderColor="gray.100">
            {children}
          </VStack>
        </Box>
      )}
    </Flex>
  )
}
