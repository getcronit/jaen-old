import {AddIcon, DeleteIcon} from '@chakra-ui/icons'
import {Button, Stack, StackDivider} from '@chakra-ui/react'
import * as React from 'react'
import {FaEye} from 'react-icons/fa'
import {useModals} from '../../../../context/Modals/ModalContext.js'

import {IJaenPage} from '../../../../../types.js'
import {
  PageContentValues,
  usePageManager
} from '../../../../context/AdminPageManager/AdminPageManager.js'
import {PageProvider} from '../../../../context/PageProvider.js'
import {pageUpdateValidation} from '../../../../helper/page/validators.js'
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

    if (rootPage == null) return null

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

  React.useEffect(() => {
    if (manager.latestAddedPageId) {
      onSelect(manager.latestAddedPageId, 'pageId')
    }
  }, [manager.latestAddedPageId])

  const onSelect = React.useCallback(
    (id: string, idType: 'path' | 'pageId' = 'path') => {
      const path = idType === 'path' ? id : manager.getPathFromPageId(id)
      const pageId = idType === 'pageId' ? id : manager.getPageIdFromPath(id)

      if (path && pageId) {
        const jaenPage = manager.onGet(pageId)

        if (jaenPage) {
          setSelectedJaenPage({
            path,
            jaenPage
          })
        }
      } else {
        setSelectedJaenPage(rootElement)
      }
    },
    [manager, rootElement]
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
    (info: {dragParentPath: string; dragPath: string; dropPath: string}) => {
      const pageId = manager.getPageIdFromPath(info.dragPath)

      if (!pageId) {
        return
      }

      const oldParentId = manager.getPageIdFromPath(info.dragParentPath)
      const newParentId = manager.getPageIdFromPath(info.dropPath)

      manager.onMove(pageId, oldParentId, newParentId)
    },
    [manager]
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
        key="view"
        size="sm"
        leftIcon={<FaEye />}
        variant="link"
        onClick={() => {
          manager.onNavigate(selectedJaenPage?.path || '/')
        }}>
        View
      </Button>,
      <Button
        key="add"
        size="sm"
        leftIcon={<AddIcon />}
        variant="link"
        onClick={() => {
          handleItemAdd(selectedJaenPage?.path || '/')
        }}>
        Add
      </Button>,
      <Button
        key="delete"
        size="sm"
        leftIcon={<DeleteIcon />}
        variant="link"
        disabled={!selectedJaenPage?.jaenPage.template}
        onClick={() => {
          void handleItemDelete(selectedJaenPage?.path || '/')
        }}>
        Delete
      </Button>
    ])

    return () => {
      toolbarActions.register([])
    }
  }, [selectedJaenPage?.path])

  return (
    <ViewLayout heading="Pages">
      <Stack
        divider={<StackDivider />}
        spacing="4"
        px={{base: '4', md: '10'}}
        h="full"
        direction={{
          base: 'column',
          md: 'row'
        }}>
        <PageTree
          px="2"
          borderRadius="md"
          minW={{
            base: 'full',
            md: 'xs'
          }}
          h={{
            base: 48,
            md: 'full'
          }}
          defaultSelectedPath="/"
          selectedPath={selectedJaenPage?.path}
          nodes={manager.pagePaths}
          onSelectPage={onSelect}
          onAddPage={handleItemAdd}
          onDeletePage={path => {
            void handleItemDelete(path)
          }}
          onMovePage={handlePageMove}
          onViewPage={manager.onNavigate}
        />

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
                slug: selectedJaenPage.jaenPage.slug,
                description:
                  selectedJaenPage.jaenPage.jaenPageMetadata.description,
                image: selectedJaenPage.jaenPage.jaenPageMetadata.image,
                excludedFromIndex: selectedJaenPage.jaenPage.excludedFromIndex
              }}
              onSubmit={handleSelectedJaenPageUpdate}
              externalValidation={(name, value) => {
                return pageUpdateValidation({
                  name,
                  value,
                  parentId: selectedJaenPage.jaenPage.parent?.id,
                  pageTree: manager.pageTree
                })
              }}
            />
          </PageProvider>
        )}
      </Stack>
    </ViewLayout>
  )
}
