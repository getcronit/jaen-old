// CMSManagementContext.tsx
import deepmerge from 'deepmerge'
import {createContext, ReactNode, useCallback, useContext, useMemo} from 'react'

import {store, useAppDispatch, useAppSelector, withRedux} from '../redux'
import {actions as pageActions} from '../redux/slices/page'
import * as statusActions from '../redux/slices/status'
import {IJaenPage} from '../types'
import {deepmergeArrayIdMerge} from '../utils/deepmerge'

// Define the type for the CMSManagementContext data
interface CMSManagementContextData {
  page: (pageId?: string) => IJaenPage
  usePage: (pageId?: string) => IJaenPage
  pages: (parentId?: string) => IJaenPage[]
  isEditing: boolean
  tree: Array<{
    id: string
    label: string
    children: Array<CMSManagementContextData['tree'][0]>
  }>
  addPage: (page: Partial<IJaenPage>) => string
  removePage: (pageId: string) => void
  updatePage: (pageId: string, updatedPage: Partial<IJaenPage>) => void
  setIsEditing: (editing: boolean) => void
}

// Create the initial context
const CMSManagementContext = createContext<CMSManagementContextData>({
  page: function () {
    throw new Error('Function not implemented.')
  },
  usePage: function () {
    throw new Error('Function not implemented.')
  },
  pages: () => [],
  tree: [],
  isEditing: false,
  addPage: () => '',
  removePage: () => {},
  updatePage: () => {},
  setIsEditing: () => {}
})

// Define the CMSManagementProvider props
interface CMSManagementProviderProps {
  staticPages: IJaenPage[]
  children: ReactNode
}

// Create the CMSManagementProvider component
export const CMSManagementProvider = withRedux(
  ({staticPages, children}: CMSManagementProviderProps) => {
    const dispatch = useAppDispatch()

    // flags?
    const isEditing = useAppSelector(state => state.status.isEditing)

    const setIsEditing = (flag: boolean) => {
      dispatch(statusActions.setIsEditing(flag))
    }

    const dynamicPagesDict = useAppSelector(state => state.page.pages.nodes)

    const pagesDict = useMemo(() => {
      let dict = {...dynamicPagesDict}

      for (const staticPage of staticPages) {
        if (dict[staticPage.id]) {
          // merge
          dict[staticPage.id] = deepmerge(staticPage, dict[staticPage.id]!, {
            arrayMerge: deepmergeArrayIdMerge
          })
        } else {
          // add
          dict[staticPage.id] = staticPage
        }
      }

      return dict
    }, [dynamicPagesDict, staticPages])

    const pages = useCallback(
      (parentId?: string) => {
        const valuesWithIds = Object.entries(pagesDict).map(([key, value]) => ({
          id: key,
          ...value
        }))

        if (parentId) {
          console.log('pagesDict', pagesDict)

          return valuesWithIds.filter(
            page => page.parent?.id === parentId
          ) as IJaenPage[]
        }
        // If no parentId is provided, return all pages
        return Object.values(valuesWithIds) as IJaenPage[]
      },
      [pagesDict]
    )

    const page = useCallback(
      (pageId: string = 'JaenPage /') => {
        const found = pages().find(p => p.id === pageId)

        if (!found) {
          throw new Error(`Could not find page with id ${pageId}`)
        }

        return found
      },
      [pages]
    )

    const usePage = useCallback(
      (pageId: string = 'JaenPage /') => {
        const found = pages().find(p => p.id === pageId)

        if (!found) {
          throw new Error(`Could not find page with id ${pageId}`)
        }

        return found
      },
      [pages]
    )

    const addPage = (page: Partial<IJaenPage>) => {
      dispatch(pageActions.page_updateOrCreate(page))

      return store.getState().page.pages.lastAddedNodeId
    }

    const updatePage = (pageId: string, updatedPage: Partial<IJaenPage>) => {
      dispatch(
        pageActions.page_updateOrCreate({
          id: pageId,
          ...updatedPage
        })
      )
    }

    const removePage = (pageId: string) => {
      dispatch(pageActions.page_markForDeletion(pageId))
    }

    const tree = useMemo(() => {
      const tree: CMSManagementContextData['tree'] = []

      // recursive function to build the tree
      const buildTree = (
        parentId?: string
      ): CMSManagementContextData['tree'] => {
        const children = pages(parentId)
        console.log('children', children, parentId)

        return children.map(child => ({
          id: child.id,
          label: child.jaenPageMetadata.title || child.slug,
          children: buildTree(child.id)
        }))
      }

      const root = page('JaenPage /')

      tree.push({
        id: root.id,
        label: root.jaenPageMetadata.title || root.slug,
        children: buildTree(root.id)
      })

      return tree
    }, [pages])

    return (
      <CMSManagementContext.Provider
        value={{
          page,
          usePage,
          pages,
          tree,
          isEditing,
          addPage,
          removePage,
          updatePage,
          setIsEditing
        }}>
        {children}
      </CMSManagementContext.Provider>
    )
  }
)

// Custom hook to consume the CMSManagementContext
export function useCMSManagementContext() {
  return useContext(CMSManagementContext)
}
