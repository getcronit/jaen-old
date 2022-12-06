import {Box, BoxProps, ButtonGroup, Tag} from '@chakra-ui/react'
import {useEffect, useRef, useState} from 'react'

export interface HighlightTooltipProps {
  children: React.ReactNode
  actions: React.ReactNode[]
  isEditing?: boolean
}

export const HighlightTooltip: React.FC<HighlightTooltipProps> = props => {
  const {children, actions} = props

  const [isOpen, setIsOpen] = useState(false)

  const boxProps: BoxProps = {}

  const boxOverlayProps: BoxProps = {}

  if (props.isEditing) {
    boxProps.onMouseEnter = () => setIsOpen(true)
    boxProps.onMouseLeave = () => setIsOpen(false)

    if (isOpen) {
      boxOverlayProps.outline = '2px solid var(--chakra-colors-pink-100)'
      boxOverlayProps.outlineOffset = 'var(--chakra-space-2)'
      boxOverlayProps.borderRadius = 'lg'
    }
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const tagContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    var observer = new IntersectionObserver(
      function () {
        const rect = containerRef.current?.getBoundingClientRect()

        if (containerRef.current) {
          if (tagContainerRef.current) {
            if (rect && rect.top > 0) {
              tagContainerRef.current.style.setProperty('top', null)
              tagContainerRef.current.style.setProperty('bottom', '100%')
            } else {
              tagContainerRef.current.style.setProperty('bottom', null)
              tagContainerRef.current.style.setProperty('top', '100%')
            }
          }
        }
      },
      {
        threshold: 1
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  })

  return (
    <Box
      ref={containerRef}
      position="relative"
      display="inline-block"
      {...boxProps}>
      <Box
        boxSize={'full'}
        pos="absolute"
        {...boxOverlayProps}
        pointerEvents="none"></Box>
      {children}
      {isOpen && (
        <ButtonGroup
          ref={tagContainerRef}
          fontSize={'xs'}
          isAttached
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '100%',
            transform: 'translateX(-50%)'
          }}>
          {actions.map((label, index) => (
            <Tag
              size="xs"
              py={1}
              px={2}
              fontWeight={'normal'}
              key={index}
              ml={index !== 0 ? '1' : undefined /* remove left border radius */}
              borderRadius="lg"
              boxShadow="none"
              bg="pink.100"
              color="pink.500">
              {label}
            </Tag>
          ))}
        </ButtonGroup>
      )}
    </Box>
  )
}
