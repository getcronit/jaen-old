import {Flex, HStack, IconButton, Stack} from '@chakra-ui/react'
import React, {useState} from 'react'

import {BsLayoutSidebarInset} from 'react-icons/bs'

import {PageTree} from '../../shared/PageTree/PageTree'
import {MediaGallery} from './components/MediaGallery/MediaGallery'
import {MediaPreview} from './components/MediaPreview/MediaPreview'
import {MediaNode, MediaPreviewState} from './types'

export interface MediaProps {
  mediaNodes: MediaNode[]

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

  isSidebarDisabled?: boolean
  isSizeSliderDisabled?: boolean
}

export const Media: React.FC<MediaProps> = ({
  mediaNodes,
  onUpload,
  onDelete,
  onUpdate,
  onDownload,
  isSidebarDisabled,
  isSizeSliderDisabled
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false) // State variable for sidebar visibility

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const [isPreview, setPreview] = useState<MediaPreviewState>(false)

  const handlePreview = (state: MediaPreviewState) => {
    setPreview(state)
  }

  const [selectedMediaNode, setSelectedMediaNode] =
    useState<MediaNode | null>(null)

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
        <HStack h="12" w="full" p="4">
          <IconButton
            aria-label="close sidebar"
            icon={<BsLayoutSidebarInset />}
            variant="ghost"
            onClick={toggleSidebar}
          />
        </HStack>

        <PageTree />
      </Stack>

      <MediaGallery
        mediaNodes={mediaNodes}
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
        isSidebarDisabled={isSidebarDisabled}
        isSizeSliderDisabled={isSizeSliderDisabled}
      />

      <MediaPreview
        mediaNodes={mediaNodes}
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
