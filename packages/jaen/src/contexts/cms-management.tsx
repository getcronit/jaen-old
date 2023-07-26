// CMSManagementContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback
} from 'react'
import {useAppDispatch, useAppSelector, withRedux} from '../redux'
import * as statusActions from '../redux/slices/status'
import {actions as pageActions} from '../redux/slices/page'
import {IJaenPage} from '../types'
import deepmerge from 'deepmerge'
import {deepmergeArrayIdMerge} from '../utils/deepmerge'

// Define the type for the CMSManagementContext data
interface CMSManagementContextData {
  page: (pageId?: string) => IJaenPage
  pages: (parentId?: string) => IJaenPage[]
  isEditing: boolean
  addPage: (page: Partial<IJaenPage>) => void
  removePage: (pageId: string) => void
  updatePage: (pageId: string, updatedPage: Partial<IJaenPage>) => void
  setIsEditing: (editing: boolean) => void
}

// Create the initial context
const CMSManagementContext = createContext<CMSManagementContextData>({
  page: function () {
    throw new Error('Function not implemented.')
  },
  pages: () => [],
  isEditing: false,
  addPage: () => {},
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
        if (parentId) {
          return Object.values(pagesDict).filter(
            page => page.parent?.id === parentId
          ) as IJaenPage[]
        }
        // If no parentId is provided, return all pages
        return Object.values(pagesDict) as IJaenPage[]
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

    const addPage = (page: Partial<IJaenPage>) => {
      dispatch(pageActions.page_updateOrCreate(page))
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

    console.log('Pages', pages())

    return (
      <CMSManagementContext.Provider
        value={{
          page,
          pages,
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
