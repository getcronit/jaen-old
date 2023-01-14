import deepmerge from 'deepmerge'
import {useMemo} from 'react'

import {IJaenPage} from '../../../types.js'
import {deepmergeArrayIdMerge} from '../../../utils/deepmerge.js'
import {RootState, useAppDeepEqualSelector} from '../../redux/index.js'
import {useAdminStaticQuery} from '../useAdminStaticQuery.js'

const getStatePages = (state: RootState) =>
  Object.keys(state.page.pages.nodes).map(id => {
    const page = state.page.pages.nodes[id]

    if (page == null) {
      throw new Error('Page not found')
    }

    const {
      slug,
      parent,
      children,
      jaenPageMetadata,
      template,
      deleted,
      excludedFromIndex
    } = page

    return {
      id,
      ...(slug && {slug}),
      ...(parent !== undefined && {parent}),
      ...(children && {children}),
      ...(jaenPageMetadata && {jaenPageMetadata}),
      ...(template && {template}),
      ...(deleted && {deleted}),
      ...(excludedFromIndex && {excludedFromIndex})
    }
  })

const mergeStaticWithStatePages = (
  staticPages: IJaenPage[],
  statePages: IJaenPage[]
): IJaenPage[] =>
  staticPages
    .concat(
      statePages.filter(
        item => staticPages.findIndex(n => n.id === item.id) === -1
      )
    )
    .map(({id}) => {
      const p1 = staticPages.find(e => e.id === id)
      const p2 = statePages.find(e => e.id === id)

      const merged = deepmerge(p1 || {}, p2 || {}, {
        arrayMerge: deepmergeArrayIdMerge
      })

      return merged
    })

/**
 * Access the PageTree of the JaenContext and Static.
 */
export const useJaenPageTree = (): IJaenPage[] => {
  const {
    allJaenPage: {nodes: staticPages}
  } = useAdminStaticQuery()
  const pages = useAppDeepEqualSelector(state =>
    getStatePages(state)
  ) as IJaenPage[]

  console.log('useJaenPageTree', staticPages, pages)

  const mergeData = useMemo(
    () => mergeStaticWithStatePages(staticPages, pages as any),
    [staticPages, pages]
  )

  // Not all jaenpages should end up in the tree
  const filteredData = useMemo(
    () =>
      mergeData.filter(
        item => !['JaenPage /admin', 'JaenPage /admin/login'].includes(item.id)
      ),
    [mergeData]
  )

  // throw error if there are no pages
  if (filteredData.length === 0) {
    throw new Error('No pages found')
  }

  console.log('useJaenPageTree', filteredData)

  return filteredData
}
