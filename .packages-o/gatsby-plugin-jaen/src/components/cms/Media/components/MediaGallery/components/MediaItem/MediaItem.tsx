import {AspectRatio, Image, Input, Skeleton, Stack} from '@chakra-ui/react'
import {MouseEventHandler} from 'react'
import {MediaNode} from '../../../../types'

export interface MediaItemProps {
  node: MediaNode

  isLast: boolean

  isSelected?: boolean
  onClick?: MouseEventHandler<HTMLDivElement> | undefined
  onDoubleClick?: MouseEventHandler<HTMLDivElement> | undefined
  onUpdateDescription?: (description: string) => void
}

export const MediaItem: React.FC<MediaItemProps> = ({
  node,
  isLast,
  isSelected,
  onClick,
  onDoubleClick,
  onUpdateDescription
}) => {
  return (
    <Stack key={node.id} id={node.id} justifyContent="center" onClick={onClick}>
      <AspectRatio
        ratio={node.width / node.height}
        objectFit="contain"
        {...(isSelected && {
          outline: '2px solid',
          outlineColor: 'brand.500',
          outlineOffset: '2px',
          borderRadius: 'lg'
        })}>
        <Image
          key={node.id}
          id={isLast ? 'last-media-item' : undefined}
          fallback={
            <Skeleton w="100%" borderRadius="lg" display="inline-block" />
          }
          w="100%"
          h="100%"
          src={node.preview?.url ?? node.url}
          alt={node.description}
          onDoubleClick={onDoubleClick}
        />
      </AspectRatio>
      <Input
        size="xs"
        textAlign="center"
        border="none"
        fontSize="xs"
        fontWeight="bold"
        defaultValue={node.description}
        onChange={e => {
          onUpdateDescription?.(e.target.value)
        }}
      />
    </Stack>
  )
}
