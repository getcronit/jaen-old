import {navigate} from 'gatsby'

import {useDisclosure} from '@chakra-ui/react'
import React from 'react'
import {PageCreator} from '../components/index.js'
import {
  generateAllPaths,
  generatePageOriginPath,
  matchPath
} from '../helper/path.js'
import {useTemplatesForPage} from '../hooks/page/useTemplaceForPage.js'
import {useJaenPageTree} from '../hooks/site/useJaenPageTree.js'
import {useAppDispatch, useAppSelector} from '../redux'
import {actions} from '../redux/slices/page.js'
import {
  PageContentValues,
  PageCreateValues,
  PageTreeItems
} from './AdminPageManager/AdminPageManager.js'
import {AdminPageManagerProvider} from './AdminPageManager/AdminPageManagerProvider.js'

export const PageManagerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children
}) => {
  const rootPageId = 'JaenPage /'

  const dispatch = useAppDispatch()

  const pageTree = useJaenPageTree()

  console.log(`PageManagerProvider `, {pageTree})

  const latestAddedPageId = useAppSelector(
    state => state.page.pages.lastAddedNodeId
  )

  const dynamicPaths = useAppSelector(state => state.page.routing.dynamicPaths)

  let [shouldUpdateDpathsFor, setShouldUpdateDpathsFor] =
    React.useState<{
      pageId: string
      create: boolean
    } | null>(null)

  React.useEffect(() => {
    if (shouldUpdateDpathsFor) {
      const {pageId, create} = shouldUpdateDpathsFor

      dispatch(
        actions.updateDynamicPaths({
          jaenPageTree: pageTree,
          pageId,
          create
        })
      )

      setShouldUpdateDpathsFor(null)
    }
  }, [pageTree])

  React.useEffect(() => {
    if (latestAddedPageId) {
      dispatch(
        actions.updateDynamicPaths({
          jaenPageTree: pageTree,
          pageId: latestAddedPageId,
          create: true
        })
      )
    }
  }, [latestAddedPageId])

  const handlePageGet = React.useCallback(
    (id: string) => {
      let jaenPage = pageTree.find(p => p.id === id)

      // TODO: Remove workaround
      if (!jaenPage) {
        jaenPage = pageTree.find(p => p.id === latestAddedPageId)
      }

      if (!jaenPage) {
        return null
      }

      return jaenPage
    },
    [pageTree]
  )

  const getPageIdFromPath = React.useCallback(
    (path: string) => {
      const page = pageTree.find(p => {
        const pagePath = generatePageOriginPath(pageTree, p)

        return pagePath && matchPath(path, pagePath)
      })

      return page?.id || null
    },
    [pageTree]
  )

  const handlePageCreate = React.useCallback(
    (parentId: string | null, values: PageCreateValues) =>
      dispatch(
        actions.page_updateOrCreate({
          parent: {
            id: parentId || rootPageId
          },
          slug: values.slug,
          jaenPageMetadata: {
            title: values.title
          },
          template: values.template.name
        })
      ),
    []
  )

  const handlePageDelete = React.useCallback((id: string) => {
    setShouldUpdateDpathsFor({pageId: id, create: false})

    dispatch(actions.page_markForDeletion(id))
  }, [])

  const handlePageMove = React.useCallback(
    (id: string, oldParentId: string | null, newParentId: string | null) => {
      setShouldUpdateDpathsFor({pageId: id, create: true})
      dispatch(
        actions.page_updateOrCreate({
          id,
          parent: newParentId ? {id: newParentId} : null,
          fromId: oldParentId || undefined
        })
      )
    },
    []
  )

  const handlePageUpdate = React.useCallback(
    (id: string, values: PageContentValues) => {
      setShouldUpdateDpathsFor({pageId: id, create: true})

      dispatch(
        actions.page_updateOrCreate({
          id,
          slug: values.slug,
          jaenPageMetadata: {
            title: values.title,
            description: values.description,
            image: values.image
          },
          excludedFromIndex: values.excludedFromIndex
        })
      )
    },
    []
  )

  const handlePageNavigate = React.useCallback(
    (id: string) => {
      // Check if the page is a dynamic or static page.
      // Navigate to /jaen/r/:path if dynamic, else to /:path
      let node = pageTree.find(p => p.id === id)

      if (!node) {
        node = pageTree.find(p => p.id === latestAddedPageId)!
      }

      let path = generatePageOriginPath(pageTree, node)

      // if (path === '/') {
      //   path += node.slug
      // } else {
      //   path += '/' + node.slug
      // }

      if (path) {
        if (dynamicPaths && path in dynamicPaths) {
          path = `/jaen/r#${path}`
        }

        navigate(path)
      }
    },
    [pageTree, dynamicPaths]
  )

  const treeItems = React.useMemo(() => {
    const paths = generateAllPaths(pageTree)

    console.log(`PageManagerProvider paths`, {paths})

    return Object.keys(paths)
      .map(path => {
        const pageId = paths[path]
        const page = pageTree.find(p => p.id === pageId)

        console.log(`PageManagerProvider path`, {path}, page, pageTree, pageId)

        if (!page) {
          return undefined
        }

        const isRoot = path === '/'

        return {
          path,
          title: page?.jaenPageMetadata?.title || pageId,
          isLocked: isRoot || !page.template
        }
      })
      .filter(Boolean) as PageTreeItems
  }, [pageTree])

  const [creatorState, setCreatorState] =
    React.useState<{
      parentId: string | null
    } | null>(null)

  const parentCreatorPage = React.useMemo(
    () =>
      creatorState?.parentId ? handlePageGet(creatorState.parentId) : null,
    [creatorState]
  )

  const templates = useTemplatesForPage(parentCreatorPage)

  const creator = useDisclosure()

  const handleCreatorToggle = (parentId: string | null) => {
    setCreatorState({
      parentId
    })
    creator.onToggle()
  }

  const handleCreatorClose = () => {
    setCreatorState(null)
    creator.onClose()
  }

  const handleCreatorSubmit = (values: PageCreateValues) => {
    if (creatorState) {
      handlePageCreate(creatorState?.parentId, values)
    }

    handleCreatorClose()
  }

  return (
    <AdminPageManagerProvider
      getPageIdFromPath={getPageIdFromPath}
      onCreate={handlePageCreate}
      onDelete={handlePageDelete}
      onMove={handlePageMove}
      onUpdate={handlePageUpdate}
      onGet={handlePageGet}
      onNavigate={handlePageNavigate}
      pageTree={treeItems}
      templates={templates.allTemplates}
      isTemplatesLoading={templates.isLoading}
      rootPageId={rootPageId}
      onToggleCreator={handleCreatorToggle}>
      <PageCreator
        finalFocusRef={null as any}
        isTemplatesLoading={templates.isLoading}
        values={{
          title: '',
          slug: '',
          template: {
            name: '',
            displayName: ''
          }
        }}
        templates={templates.templates}
        isOpen={creator.isOpen}
        onClose={handleCreatorClose}
        onSubmit={handleCreatorSubmit}
        externalValidation={() => {
          // return pageUpdateValidation({
          //   name,
          //   value,
          //   treeItems,
          //   parentId: creatorState?.parentId
          // })

          return ''
        }}
      />
      {children}
    </AdminPageManagerProvider>
  )
}
