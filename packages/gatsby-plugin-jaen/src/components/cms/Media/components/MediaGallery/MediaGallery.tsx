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
  FaCheck,
  FaDotCircle,
  FaDownload,
  FaHandPointer,
  FaMinus,
  FaPlus,
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaTrash
} from 'react-icons/fa'
import {useLocation} from '@reach/router'

import {MediaNode, MediaPreviewState} from '../../types'
import {MediaGrid} from './components/MediaGrid/MediaGrid'
import {FaRadio} from 'react-icons/fa6'

export interface MediaGalleryProps {
  mediaNodes: MediaNode[]

  selectedMediaNode: MediaNode | null
  onSelectMediaNode: (node: MediaNode | null) => void

  onUpload: (files: File[]) => Promise<void>
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

  isSelector?: boolean
  onSelect?: (id: string) => void
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
  isSelector,
  onSelect
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearchChange: React.ChangeEventHandler<
    HTMLInputElement
  > = event => {
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
    return mediaNodes.filter(node => {
      if (searchQuery.length === 0) return true

      return node.description?.toLowerCase().includes(searchQuery.toLowerCase())
    })
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

  console.log('nodes', mediaNodes)

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

  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleOnUpload = async (files: File[]) => {
    setIsUploading(true)

    await onUpload(files)

    setIsUploading(false)
  }

  const dropzone = useDropzone({
    onDrop: handleOnUpload,
    accept: {
      'image/*': []
    }
  })

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search)

  //   const pageFilter = searchParams.get('page')

  //   if (pageFilter) {
  //     setPageFilter(pageFilter)
  //   }

  //   const upload = searchParams.get('upload')

  //   console.log('upload', dropzone)

  //   if (upload === 'true' && !dropzone.isFileDialogActive) {
  //     // wait for media gallery to be rendered
  //     dropzone.open()
  //   }

  //   // // reset search params
  //   // searchParams.delete('page')
  //   // searchParams.delete('upload')

  //   // window.history.replaceState(
  //   //   {},
  //   //   '',
  //   //   `${window.location.pathname}?${searchParams.toString()}`
  //   // )
  // }, [dropzone.isFileDialogActive])

  console.log('MediaGallery.tsx')

  return (
    <Box w="full">
      <HStack
        visibility={isPreview ? 'hidden' : 'visible'}
        h="12"
        w="full"
        px="4"
        top="0"
        pos="sticky"
        zIndex="2"
        bg="bg.surface"
        borderBottom="1px solid"
        borderColor="border.emphasized">
        <HStack display={{base: 'none', md: 'flex'}}>
          <HStack display={{base: 'none', md: 'flex'}}>
            {!isSelector && !isSidebarOpen && (
              <IconButton
                aria-label="open sidebar"
                fontSize="1.2em"
                icon={<BsLayoutSidebarInset />}
                variant="ghost"
                onClick={onToggleSidebar}
              />
            )}

            <Icon
              as={FaMinus}
              boxSize="2"
              onClick={() => {
                if (columnCount === 1) return

                setColumnCount(columnCount - 1)
              }}
            />
            <Slider
              w="12"
              aria-label="slider-image-size"
              value={columnCount}
              min={1}
              max={5}
              onChange={value => {
                setColumnCount(value)
              }}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Icon
              as={FaPlus}
              boxSize="2"
              onClick={() => {
                if (columnCount === 5) return

                setColumnCount(columnCount + 1)
              }}
            />
          </HStack>

          {!isSelector && pageFilter && (
            <Tag size="md" variant="subtle">
              {pageFilter}
              <TagCloseButton
                onClick={() => {
                  setPageFilter(null)
                }}
              />
            </Tag>
          )}
        </HStack>

        <Spacer />

        <InputGroup maxW="md" size="sm">
          <InputLeftElement pointerEvents="none" h="full">
            <Icon as={FaSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <InputRightElement h="full" mr="1">
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

        <Box display={{base: 'block', md: 'none'}}>
          <IconButton
            size="xs"
            variant="outline"
            aria-label={
              dropzone.isDragActive ? 'Drop to upload' : 'Upload images'
            }
            icon={
              <FaPlus
                style={{
                  transform: dropzone.isDragActive ? 'rotate(15deg)' : 'none'
                }}
              />
            }
            isLoading={isUploading}
            onClick={dropzone.open}
          />
        </Box>

        <Box display={{base: 'none', md: 'block'}}>
          {dropzone.isDragActive ? (
            <Button size="xs" leftIcon={<FaPlus />} colorScheme="orange">
              Drop to upload
            </Button>
          ) : (
            <Button
              variant="outline"
              size="xs"
              leftIcon={<FaPlus />}
              isLoading={isUploading}
              onClick={dropzone.open}>
              Upload
            </Button>
          )}
        </Box>

        <Button
          display={isSelector ? 'block' : 'none'}
          leftIcon={<FaCheck />}
          size="sm"
          isDisabled={selectedMediaNode === null}
          onClick={() => {
            if (isSelector && selectedMediaNode) {
              onSelect?.(selectedMediaNode?.id)
            }
          }}>
          Choose
        </Button>
      </HStack>

      <Box
        {...dropzone.getRootProps({
          onClick: event => {
            event.stopPropagation()
          }
        })}
        h="full"
        pos="relative"
        p="1">
        <input {...dropzone.getInputProps()} />

        {dropzone.isDragActive && (
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
          columnCount={6 - columnCount}
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