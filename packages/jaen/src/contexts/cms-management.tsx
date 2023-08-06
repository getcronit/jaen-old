// CMSManagementContext.tsx
import deepmerge from 'deepmerge'
import {createContext, ReactNode, useCallback, useContext, useMemo} from 'react'

import {
  resetState,
  store,
  useAppDispatch,
  useAppSelector,
  withRedux
} from '../redux'
import {actions as pageActions} from '../redux/slices/page'
import * as statusActions from '../redux/slices/status'
import {actions as siteActions} from '../redux/slices/site'

import {JaenPage, JaenTemplate, SiteMetadata} from '../types'
import {deepmergeArrayIdMerge} from '../utils/deepmerge'

// Errors

export class DuplicateSlugError extends Error {
  constructor(slug: string) {
    super(`Could not add page with slug ${slug} as it is not unique`)
  }
}

// Define the type for the CMSManagementContext data
interface CMSManagementContextData {
  templates: JaenTemplate[]
  templatesForPage: (pageId: string) => JaenTemplate[]

  siteMetadata: Partial<SiteMetadata>
  updateSiteMetadata: (siteMetadata: Partial<SiteMetadata>) => void

  page: (pageId?: string) => JaenPage
  usePage: (pageId?: string) => JaenPage
  pages: (parentId?: string) => JaenPage[]
  isEditing: boolean
  isPublishing: boolean
  setIsPublishing: (publishing: boolean) => void
  tree: Array<{
    id: string
    label: string
    children: Array<CMSManagementContextData['tree'][0]>
  }>
  pagePath: (pageId: string) => string
  addPage: (page: Partial<JaenPage>) => string
  removePage: (pageId: string) => void
  updatePage: (pageId: string, updatedPage: Partial<JaenPage>) => void
  setIsEditing: (editing: boolean) => void

  draft: {
    save: () => void
    import: () => Promise<void>
    discard: () => void
    publish: () => void
  }
}

// Create the initial context
const CMSManagementContext = createContext<CMSManagementContextData>({
  templates: [],
  templatesForPage: () => [],

  siteMetadata: {},
  updateSiteMetadata: () => {},

  page: function () {
    throw new Error('Function not implemented.')
  },
  usePage: function () {
    throw new Error('Function not implemented.')
  },
  pages: () => [],
  tree: [],
  pagePath: () => '',
  isEditing: false,
  isPublishing: false,
  setIsPublishing: () => {},
  addPage: () => '',
  removePage: () => {},
  updatePage: () => {},
  setIsEditing: () => {},
  draft: {
    save: () => {},
    import: () => Promise.resolve(),
    discard: () => {},
    publish: () => {}
  }
})

// Define the CMSManagementProvider props
interface CMSManagementProviderProps {
  staticPages: JaenPage[]
  templates: JaenTemplate[]
  children: ReactNode
}

// Create the CMSManagementProvider component
export const CMSManagementProvider = withRedux(
  ({staticPages, children, templates}: CMSManagementProviderProps) => {
    const dispatch = useAppDispatch()

    const siteMetadata = useAppSelector(state => state.site.siteMetadata)

    const updateSiteMetadata = useCallback(
      (siteMetadata: Partial<SiteMetadata>) => {
        dispatch(siteActions.updateSiteMetadata(siteMetadata))
      },
      [dispatch]
    )

    // flags?
    const isEditing = useAppSelector(state => state.status.isEditing)

    const setIsEditing = (flag: boolean) => {
      dispatch(statusActions.setIsEditing(flag))
    }

    const isPublishing = useAppSelector(state => state.status.isPublishing)

    const setIsPublishing = (flag: boolean) => {
      dispatch(statusActions.setIsPublishing(flag))
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

      for (const pageId of Object.keys(dict)) {
        // filter out deleted pages
        if (dict[pageId]?.isDeleted) {
          delete dict[pageId]
        }

        // filter out deleted children
        if (dict[pageId]?.children) {
          dict[pageId] = {
            ...dict[pageId],
            children: dict[pageId]?.children?.filter(child => !child.deleted)
          }
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
          ) as JaenPage[]
        }
        // If no parentId is provided, return all pages
        return Object.values(valuesWithIds) as JaenPage[]
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

        console.log('found', found)

        return found
      },
      [pages]
    )

    const addPage = (page: Partial<JaenPage>) => {
      // check if slug is unique
      const slug = page.slug || 'new-page'

      const isSlugDuplicate = pages().some(page => page.slug === slug)

      if (isSlugDuplicate) {
        throw new DuplicateSlugError(slug)
      }

      dispatch(pageActions.page_updateOrCreate(page))

      return store.getState().page.pages.lastAddedNodeId
    }

    const updatePage = (
      pageId: string,
      updatedPage: Partial<JaenPage>
    ): void => {
      const page = pagesDict[pageId]

      // check if slug is unique when moving page
      if (updatedPage.parent?.id) {
        const slug = updatedPage.slug || 'new-page'

        const isSlugDuplicate = pages(updatedPage.parent?.id).some(
          page => page.slug === slug && page.id !== pageId
        )

        if (isSlugDuplicate) {
          throw new DuplicateSlugError(slug)
        }
      }

      dispatch(
        pageActions.page_updateOrCreate({
          id: pageId,
          ...updatedPage,
          fromId: page?.parent?.id
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

    const pagePath = useCallback(
      (pageId: string) => {
        const page = pagesDict[pageId]

        if (!page) {
          throw new Error(`Could not find page with id ${pageId}`)
        }

        const path = [page.slug]

        let parent = pagesDict[page.parent?.id || '']

        while (parent) {
          path.unshift(parent.slug)
          parent = pagesDict[parent.parent?.id || '']
        }

        return path.join('/') || '/'
      },
      [pagesDict]
    )

    const templatesForPage = useCallback(
      (pageId: string) => {
        const page = pagesDict[pageId]

        if (!page) {
          throw new Error(`Could not find page with id ${pageId}`)
        }

        console.log('page', page)

        if (page.template) {
          return (
            templates.find(template => template.id === page.template)
              ?.childTemplates || []
          )
        }

        if (page.childTemplates) {
          const childTemplates: JaenTemplate[] = []

          for (const childTemplateId of page.childTemplates) {
            const childTemplate = templates.find(
              template => template.id === childTemplateId
            )

            if (childTemplate) {
              childTemplates.push(childTemplate)
            }
          }

          return childTemplates
        }

        return []
      },
      [pagesDict, templates]
    )

    const saveDraft = useCallback(() => {
      // Implement the logic to save the draft state in the Redux store
      // For example, you can update the draft state for the current page in the DraftData object
      // dispatch(draftActions.saveDraft(pageId));

      const state = store.getState()

      // Generate a unique identifier for the draft
      const draftId = Date.now()
      const blob = new Blob([JSON.stringify({draftId, state})], {
        type: 'application/json'
      })

      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `jaen-draft-${draftId}.json`

      // Programmatically initiate the download
      a.click()

      // Remove the temporary anchor element
      a.remove()
    }, [])

    const importDraft = useCallback(async () => {
      return new Promise<void>((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'

        // Attach an onchange event handler to handle the file selection
        input.onchange = () => {
          const file = input.files?.item(0)

          if (!file) return

          const reader = new FileReader()

          // Read the selected file as text
          reader.onload = () => {
            try {
              const content = JSON.parse(reader.result as string)
              const {draftId, state} = content

              // Perform a validation here to check if the draftId exists and matches the filename
              const regex = /^jaen-draft-(\d+)\.json$/
              const match = file.name.match(regex)
              if (match && match[1] === draftId.toString()) {
                // Dispatch an action with the parsed state object to update the Redux store
                resetState(state)

                // Resolve the promise
                resolve()
              } else {
                // Handle invalid file (the file is not a valid draft file)
                reject('Invalid draft file. Please select a valid draft file.')
              }
            } catch (error) {
              console.error(error)
              // Handle JSON parsing error
              reject(
                'Error parsing draft file. Please select a valid draft file.'
              )
            }
          }

          // Start reading the selected file
          reader.readAsText(file)
        }

        // Programmatically trigger the file input click to open the file picker
        input.click()
      })
    }, [])

    const discardDraft = useCallback(() => {
      dispatch(pageActions.discardAllChanges())

      // reset status
      setIsEditing(false)
      setIsPublishing(false)
    }, [setIsEditing, setIsPublishing])

    const publishDraft = useCallback(() => {
      // Implement the logic to publish the draft state in the Redux store
      // For example, you can apply the draft changes to the actual page state
      // dispatch(draftActions.publishDraft(pageId));
    }, [])

    return (
      <CMSManagementContext.Provider
        value={{
          templates,
          siteMetadata,
          updateSiteMetadata,
          page,
          usePage,
          pages,
          templatesForPage,
          tree,
          pagePath,
          isEditing,
          isPublishing,
          setIsPublishing,
          addPage,
          removePage,
          updatePage,
          setIsEditing,
          draft: {
            save: saveDraft,
            import: importDraft,
            discard: discardDraft,
            publish: publishDraft
          }
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
