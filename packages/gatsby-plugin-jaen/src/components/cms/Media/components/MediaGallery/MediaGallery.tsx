// MediaGallery.tsx
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Tag,
  TagCloseButton
} from '@chakra-ui/react'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {BsLayoutSidebarInset} from 'react-icons/bs'
import {
  FaDownload,
  FaMinus,
  FaPlus,
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaTrash
} from 'react-icons/fa'

import {MediaNode, MediaPreviewState} from '../../types'
import {MediaGrid} from './components/MediaGrid/MediaGrid'

export interface MediaGalleryProps {
  mediaNodes: MediaNode[]

  selectedMediaNode: MediaNode | null
  onSelectMediaNode: (node: MediaNode | null) => void

  onUpload: (files: File[]) => void
  onDelete: (ids: string) => void
  onUpdate: (
    id: string,
    data: Partial<
      MediaNode & {
        file: File
      }
    >
  ) => void
  onDownload: (id: string) => void

  isSidebarOpen: boolean
  onToggleSidebar: () => void

  isPreview: MediaPreviewState
  onPreview: (state: MediaPreviewState) => void

  isSidebarDisabled?: boolean
  isSizeSliderDisabled?: boolean
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  mediaNodes,
  selectedMediaNode,
  onSelectMediaNode,
  onUpload,
  onDelete,
  onUpdate,
  onDownload,
  isSidebarOpen,
  onToggleSidebar,
  isPreview,
  onPreview,
  isSidebarDisabled,
  isSizeSliderDisabled
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> =
    event => {
      setSearchQuery(event.target.value)

      // reset selected media node
      onSelectMediaNode(null)
    }

  const [pageFilter, setPageFilter] = useState<string | null>('Home')

  const [mediaNodesLimit, setMediaNodesLimit] = useState<number>(30)

  const onLoadMore = useCallback(() => {
    setMediaNodesLimit(mediaNodesLimit + 30)
  }, [mediaNodesLimit])

  const filteredMediaNodes = useMemo(() => {
    return mediaNodes.filter(node =>
      node.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [mediaNodes, searchQuery])

  const limitedMediaNodes = useMemo(
    () => filteredMediaNodes.slice(0, mediaNodesLimit),
    [filteredMediaNodes, mediaNodesLimit]
  )

  const [columnCount, setColumnCount] = useState<number>(3)

  const handleDownload = () => {
    if (selectedMediaNode) {
      // call onDownload callback

      onDownload(selectedMediaNode.id)
    }
  }

  const handleDelete = () => {
    if (selectedMediaNode) {
      // call onDelete callback

      onDelete(selectedMediaNode.id)
      onSelectMediaNode(null)

      onPreview(false)
    }
  }

  const handleEdit = () => {
    if (selectedMediaNode) {
      // call onEdit callback

      onPreview('EDIT')
    }
  }

  const handleUpdate = (
    data: Partial<
      MediaNode & {
        file: File
      }
    >
  ) => {
    if (selectedMediaNode) {
      // call onUpdate callback

      onUpdate(selectedMediaNode.id, data)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const lastMediaItem = document.getElementById('last-media-item') // Add an ID to the last media item in the list

      if (lastMediaItem) {
        const rect = lastMediaItem.getBoundingClientRect()
        const isAtBottom = rect.bottom <= window.innerHeight

        if (isAtBottom) {
          onLoadMore()
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [onLoadMore])

  useEffect(() => {
    // scroll to selected media item
    if (selectedMediaNode) {
      const selectedMediaItem = document.getElementById(selectedMediaNode.id)

      if (selectedMediaItem) {
        selectedMediaItem.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [selectedMediaNode?.id])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openUpload
  } = useDropzone({
    onDrop: acceptedFiles => {
      console.log('Dropped files:', acceptedFiles)

      if (acceptedFiles.length > 0) {
        // call onUpload callback

        onUpload(acceptedFiles)
      }
    },
    accept: {
      'image/*': []
    }
  })

  return (
    <Box w="full">
      <HStack
        visibility={isPreview ? 'hidden' : 'visible'}
        h="12"
        w="full"
        p="4"
        top="0"
        pos="sticky"
        zIndex="2"
        bg="bg.surface"
        borderBottom="1px solid"
        borderColor="border.emphasized">
        {!isSidebarDisabled && !isSidebarOpen && (
          <IconButton
            aria-label="open sidebar"
            icon={<BsLayoutSidebarInset />}
            variant="ghost"
            onClick={onToggleSidebar}
          />
        )}

        {!isSizeSliderDisabled && (
          <HStack>
            <Icon as={FaMinus} boxSize="2" />
            <Slider
              w="12"
              aria-label="slider-image-size"
              defaultValue={3}
              min={1}
              max={5}
              onChange={value => {
                setColumnCount(6 - value)
              }}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Icon as={FaPlus} boxSize="2" />
          </HStack>
        )}

        {pageFilter && (
          <Tag size="md" variant="subtle">
            {pageFilter}
            <TagCloseButton
              onClick={() => {
                setPageFilter(null)
              }}
            />
          </Tag>
        )}

        <Spacer />

        <InputGroup maxW="md" size="sm">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <InputRightElement>
              <IconButton
                aria-label="Clear search"
                variant="ghost"
                size="xs"
                icon={<FaTimes />}
                onClick={() => {
                  setSearchQuery('')
                }}
              />
            </InputRightElement>
          )}
        </InputGroup>

        <ButtonGroup
          variant="outline"
          size="xs"
          isDisabled={selectedMediaNode === null}>
          <IconButton
            aria-label="Customize selected image"
            icon={<FaSlidersH />}
            onClick={handleEdit}
          />

          <IconButton
            aria-label="Download selected image"
            icon={<FaDownload />}
            onClick={handleDownload}
          />
          <IconButton
            aria-label="Delete selected image"
            icon={<FaTrash />}
            onClick={handleDelete}
          />
        </ButtonGroup>

        {isDragActive ? (
          <Button size="xs" leftIcon={<FaPlus />} colorScheme="orange">
            Drop to upload
          </Button>
        ) : (
          <Button
            variant="outline"
            size="xs"
            leftIcon={<FaPlus />}
            onClick={openUpload}>
            Upload
          </Button>
        )}
      </HStack>

      <Box
        {...getRootProps({
          onClick: event => {
            event.stopPropagation()
          }
        })}
        pos="relative">
        <input {...getInputProps()} />

        {isDragActive && (
          <Box
            bg="bg.translucent"
            backdropFilter="blur(8px) saturate(180%) contrast(46%) brightness(120%)"
            pos="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
        )}

        <MediaGrid
          mediaNodes={limitedMediaNodes}
          columnCount={columnCount}
          selectedMediaNode={selectedMediaNode}
          onSelect={onSelectMediaNode}
          onDoubleClick={() => {
            onPreview('PREVIEW')
          }}
          onUpdateDescription={description => {
            handleUpdate({description})
          }}
        />
      </Box>
    </Box>
  )
}
