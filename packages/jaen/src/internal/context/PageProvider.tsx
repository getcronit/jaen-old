import React from 'react'
import {IJaenPage} from '../../types.js'
import {store, useAppDispatch, withRedux} from '../redux'
import {actions} from '../redux/slices/page.js'
import {useAuth} from '../hooks/auth/useAuth.js'
import {IJaenState} from '../redux/types.js'

export interface PageProviderProps {
  jaenPage: {
    id: string
  } & Partial<IJaenPage>
  jaenPages?: Array<Partial<IJaenPage>>
  unregisterFields?: boolean
}

export interface PageContext extends PageProviderProps {}

export const PageContext =
  React.createContext<PageContext | undefined>(undefined)

const UnregisterFieldsHelper = withRedux(() => {
  const {jaenPage} = usePageContext()

  const dispatch = useAppDispatch()

  React.useEffect(() => {
    dispatch(
      actions.page_unregisterFields({
        pageId: jaenPage.id
      })
    )
  }, [jaenPage.id])

  return null
})

export const PageProvider: React.FC<
  React.PropsWithChildren<PageProviderProps>
> = ({children, jaenPage, jaenPages, unregisterFields = true}) => {
  const {isAuthenticated} = useAuth()

  return (
    <PageContext.Provider
      value={{
        jaenPage,
        jaenPages
      }}>
      {unregisterFields && isAuthenticated && <UnregisterFieldsHelper />}
      {children}
    </PageContext.Provider>
  )
}

/**
 * Access the PageContext.
 *
 * @example
 * ```
 * const {jaenPage} = usePageContext()
 * ```
 */
export const usePageContext = () => {
  const context = React.useContext(PageContext)

  if (context === undefined) {
    throw new Error('useJaenPageContext must be within PageContext')
  }

  return context
}

export interface UsePageIndexProps {
  /**
   * Opts out the field from the page content on which it is applied.
   * Instead the page context of the provided jaenPageId will be used.
   *
   * Priority: jaenPageId > path > current page
   */
  jaenPageId?: string
  /**
   * Opts out the field from the page content on which it is applied.
   * Instead it resolves the page by the provided path.
   *
   * This is useful when you want to use a dynamic page as a context.
   *
   * Priority: jaenPageId > path > current page
   */
  path?: string
  filter?: (page: Partial<IJaenPage>) => boolean
  sort?: (a: Partial<IJaenPage>, b: Partial<IJaenPage>) => number
}

export const useJaenPageIndex = (
  props?: UsePageIndexProps
): {
  children: Array<{id: string} & Partial<IJaenPage>>
  withJaenPage: (childId: string, children: React.ReactNode) => React.ReactNode
} => {
  let {jaenPage, jaenPages} = usePageContext()

  let id = jaenPage.id
  let staticChildren = jaenPage.children

  if (props?.jaenPageId) {
    id = props?.jaenPageId
  } else if (props?.path) {
    if (!jaenPages) {
      throw new Error('Unable to resolve page by path. No pages provided.')
    }

    const resolveJaenPageIdByPath = (
      path: string,
      staticPages: Array<Partial<IJaenPage>>
    ) => {
      const dynamicPageId =
        store.getState().internal.routing.dynamicPaths[path]?.pageId

      if (dynamicPageId) {
        return dynamicPageId
      }

      return staticPages.find(page => page.buildPath === path)?.id
    }

    const path = props?.path

    const newId = resolveJaenPageIdByPath(path, jaenPages)

    if (!newId) {
      throw new Error(`Could not resolve page by path: ${path}`)
    }

    id = newId
  }

  if (id !== jaenPage.id) {
    if (jaenPages) {
      staticChildren = jaenPages.find(page => page.id === id)?.children
    } else {
      console.warn('There are no jaenPages in the context')
    }
  }

  const [dynamicChildrenIds, setDynamicChildrenIds] = React.useState(() => {
    const state = store.getState() as IJaenState

    return state.page.pages.nodes[id]?.children
  })

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      const page = state.internal.pages.nodes[id]
      if (page) {
        setDynamicChildrenIds(page.children)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [id])

  const dynamicChildren = React.useMemo(() => {
    if (dynamicChildrenIds) {
      const dynamicJaenPages = store.getState().internal.pages.nodes
      return dynamicChildrenIds.map(({id}) => ({
        id,
        ...dynamicJaenPages[id]
      })) as IJaenPage[]
    }

    return []
  }, [dynamicChildrenIds])

  staticChildren = staticChildren || []

  // merge children with staticChildren by id
  let children = [...staticChildren, ...dynamicChildren]

  children = children.filter(c => !c.excludedFromIndex)

  if (props) {
    const {filter, sort} = props

    if (filter) {
      children = children.filter(filter)
    }

    if (sort) {
      children = children.sort(sort)
    }
  }

  return {
    children,
    withJaenPage: (childId: string, children: React.ReactNode) => {
      const jaenPage = staticChildren?.find(c => c.id === childId)

      return (
        <PageProvider jaenPage={{...jaenPage, id: childId}} key={childId}>
          {children}
        </PageProvider>
      )
    }
  }
}
