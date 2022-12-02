import {AddIcon} from '@chakra-ui/icons'
import {Button, Stack, StackDivider, Text} from '@chakra-ui/react'
import * as React from 'react'
import {FaEye} from 'react-icons/fa'
import {useModals} from '../../../../context/Modals/ModalContext.js'

import {PageProvider} from 'src/internal/context/PageProvider.js'
import {IJaenPage} from 'src/types.js'
import {
  PageContentValues,
  usePageManager
} from '../../../../context/AdminPageManager/AdminPageManager.js'
import {
  PageContent,
  PageTree,
  useToolbarActions,
  ViewLayout
} from '../../../organisms/index.js'

export interface PagesViewProps {}

export const PagesView: React.FC<PagesViewProps> = () => {
  const manager = usePageManager()

  const {confirm, toast} = useModals()

  // const relativeRootPageId = selection.id === rootPageId ? null : selection.id

  // const isSelectionLandingPage = selection?.id === rootPageId

  const rootElement = React.useMemo(() => {
    const rootPageId = manager.getPageIdFromPath('/')

    if (!rootPageId) return null

    const rootPage = manager.onGet(rootPageId)

    if (!rootPage) return null

    return {
      path: '/',
      jaenPage: rootPage
    }
  }, [manager])

  const [selectedJaenPage, setSelectedJaenPage] =
    React.useState<{
      path: string
      jaenPage: IJaenPage
    } | null>(rootElement)

  const onSelect = React.useCallback(
    (path: string) => {
      const pageId = manager.getPageIdFromPath(path)

      if (pageId) {
        const page = manager.onGet(pageId)

        if (page) {
          setSelectedJaenPage({
            path,
            jaenPage: page
          })
        }
      } else {
        setSelectedJaenPage(rootElement)
      }
    },
    [manager]
  )

  const handleSelectedJaenPageUpdate = React.useCallback(
    (values: PageContentValues) => {
      selectedJaenPage && manager.onUpdate(selectedJaenPage.jaenPage.id, values)
    },
    [selectedJaenPage]
  )

  const handleItemAdd = React.useCallback(
    (path: string) => {
      const parentPageId = manager.getPageIdFromPath(path)

      manager.onToggleCreator(parentPageId)

      toast({
        title: `Create a new page under ${path}`,
        status: 'info',
        isClosable: true
      })
    },
    [manager]
  )

  const handleItemDelete = React.useCallback(async (path: string) => {
    const shouldDelete = await confirm(
      `Are you sure you want to delete the page "${path}"?`
    )

    if (shouldDelete) {
      toast({
        title: 'Page deleted',
        status: 'success'
      })
    }
  }, [])

  const handlePageMove = React.useCallback(
    (info: {path: string; dragPath: string; dropPath: string}) => {
      const pageId = manager.getPageIdFromPath(info.path)

      if (!pageId) {
        return
      }

      const oldParentId = manager.getPageIdFromPath(info.dragPath)
      const newParentId = manager.getPageIdFromPath(info.dropPath)

      manager.onMove(pageId, oldParentId, newParentId)
    },
    []
  )

  const selectedTemplate = React.useMemo(
    () =>
      manager.templates.find(
        t => t.name === selectedJaenPage?.jaenPage.template
      ) || null,
    [manager.templates, selectedJaenPage?.jaenPage.template]
  )

  // const pageTitle = selection?.jaenPageMetadata.title || 'Page'

  // const templatesForPage = React.useMemo(
  //   () => manager.templates.find(t => t.name === selection?.template),
  //   [manager.templates, selection?.template]
  // )

  // const disableAdd = templatesForPage
  //   ? templatesForPage.children.length === 0
  //   : false

  // const disableDelete = !selection?.template || isSelectionLandingPage
  // const disableNavigate = !selection

  const toolbarActions = useToolbarActions()

  React.useEffect(() => {
    toolbarActions.register([
      <Button
        size="sm"
        leftIcon={<AddIcon />}
        variant="link"
        onClick={() => handleItemAdd(selectedJaenPage?.path || '/')}>
        Add page
      </Button>,
      <Button size="sm" leftIcon={<FaEye />} variant="link">
        Page view
      </Button>
    ])

    return () => {
      toolbarActions.register([])
    }
  }, [selectedJaenPage?.path])

  return (
    <ViewLayout
      px={{
        base: 2,
        md: 4
      }}
      py={{
        base: 4,
        md: 8
      }}>
      <Stack
        rounded="lg"
        px={{
          base: 2,
          md: 4
        }}
        py={{
          base: 4,
          md: 8
        }}
        bg="white"
        shouldWrapChildren
        divider={<StackDivider />}
        spacing="4"
        h="full"
        direction={{
          base: 'column',
          md: 'row'
        }}>
        <PageTree
          px="2"
          borderRadius={'md'}
          minW={{
            base: 'full',
            md: 'xs'
          }}
          h={{
            base: 48,
            md: 'full'
          }}
          defaultSelectedPath={'/'}
          nodes={manager.pageTree}
          onSelectPage={onSelect}
          onAddPage={handleItemAdd}
          onDeletePage={handleItemDelete}
          onMovePage={handlePageMove}
        />

        <Text>Path: {selectedJaenPage?.path}</Text>

        {selectedJaenPage && (
          <PageProvider
            jaenPage={selectedJaenPage.jaenPage}
            unregisterFields={false}>
            <PageContent
              key={selectedJaenPage.jaenPage.id}
              template={selectedTemplate}
              jaenPageId={selectedJaenPage.jaenPage.id}
              publishedAt={
                selectedJaenPage.jaenPage.jaenPageMetadata.datePublished
              }
              values={{
                title: selectedJaenPage.jaenPage.jaenPageMetadata.title,
                slug: selectedJaenPage.jaenPage.slug || 'root',
                description:
                  selectedJaenPage.jaenPage.jaenPageMetadata.description,
                image: selectedJaenPage.jaenPage.jaenPageMetadata.image,
                excludedFromIndex: selectedJaenPage.jaenPage.excludedFromIndex
              }}
              onSubmit={handleSelectedJaenPageUpdate}
              // externalValidation={(name, value) => {
              //   return pageUpdateValidation({
              //     name,
              //     value,
              //     parentId: selection.parent?.id,
              //     treeItems: manager.tree
              //   })
              // }}
            />
          </PageProvider>
        )}
      </Stack>
    </ViewLayout>
  )
}
