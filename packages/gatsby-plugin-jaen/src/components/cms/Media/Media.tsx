import {
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  StackDivider
} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react'

import {BsLayoutSidebarInset} from 'react-icons/bs'

import {PageTree} from '../../shared/PageTree/PageTree'
import {TreeNode} from '../Pages/shared/PageVisualizer'
import {MediaGallery} from './components/MediaGallery/MediaGallery'
import {MediaPreview} from './components/MediaPreview/MediaPreview'
import {MediaNode, MediaPreviewState} from './types'

export interface MediaProps {
  mediaNodes: MediaNode[]
  tree: Array<TreeNode>

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

  isSelector?: boolean
  onSelect?: (id: string) => void
}

export const Media: React.FC<MediaProps> = ({
  tree,
  mediaNodes,
  onUpload,
  onDelete,
  onUpdate,
  onDownload,
  isSelector,
  onSelect
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false) // State variable for sidebar visibility

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const [isPreview, setPreview] = useState<MediaPreviewState>(false)

  const handlePreview = (state: MediaPreviewState) => {
    setPreview(state)
  }

  const [selectedMediaNode, setSelectedMediaNode] = useState<MediaNode | null>(
    null
  )

  useEffect(() => {
    // reselect media node if it still exists
    if (selectedMediaNode) {
      const node = mediaNodes.find(node => node.id === selectedMediaNode.id)

      if (node) {
        setSelectedMediaNode(node)
      } else {
        setSelectedMediaNode(null)
      }
    }
  }, [mediaNodes])

  const sortedMediaNodes = mediaNodes.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <Flex id="coco" pos="relative" minH="calc(100dvh - 4rem - 3rem)">
      <Stack
        as="nav"
        h="calc(100dvh - 4rem)"
        pos="sticky"
        top="0"
        w="xs"
        borderRight="1px solid"
        borderColor="border.emphasized"
        overflow="auto"
        display={isSidebarOpen ? 'block' : 'none'} // Show/hide sidebar based on state
      >
        <HStack w="full" px="4" h="12">
          <IconButton
            aria-label="close sidebar"
            fontSize="1.2em"
            icon={<BsLayoutSidebarInset />}
            variant="ghost"
            onClick={toggleSidebar}
          />
        </HStack>
        <Stack px="4" py="1" ml="2">
          <Stack>
            <Heading size="xs">Media</Heading>

            <Stack>
              <Button size="sm" variant="outline" onClick={() => {}}>
                Upload
              </Button>
            </Stack>
          </Stack>

          <Stack>
            <Heading size="xs">Pages</Heading>
            <PageTree tree={tree} onSelected={() => {}} />
          </Stack>
        </Stack>
      </Stack>

      <MediaGallery
        mediaNodes={sortedMediaNodes}
        selectedMediaNode={selectedMediaNode}
        onSelectMediaNode={setSelectedMediaNode}
        onUpload={onUpload}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onDownload={onDownload}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        isPreview={isPreview}
        onPreview={handlePreview}
        isSelector={isSelector}
        onSelect={onSelect}
      />

      <MediaPreview
        mediaNodes={sortedMediaNodes}
        isPreview={isPreview}
        selectedMediaNode={selectedMediaNode}
        onSelectMediaNode={setSelectedMediaNode}
        onPreview={handlePreview}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onDownload={onDownload}
      />
    </Flex>
  )
}
