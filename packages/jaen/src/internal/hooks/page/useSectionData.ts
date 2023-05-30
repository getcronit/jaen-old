import deepmerge from 'deepmerge'
import * as React from 'react'
import {IJaenBlock} from '../../../types.js'
import {deepmergeArrayIdMerge} from '../../../utils/deepmerge.js'
import {usePageContext} from '../../context/PageProvider.js'
import {useSectionBlockContext} from '../../context/SectionBlockContext.js'
import {findSection} from '../../helper/page/section.js'
import {useAppSelector} from '../../redux/index.js'

export function useSectionData(
  sectionName: string,
  options?: {forceUpdate?: boolean}
) {
  const {forceUpdate = false} = options || {}

  const jaenSection = useSectionBlockContext()

  const sectionPath = React.useMemo(
    () =>
      (jaenSection?.path || []).concat({
        fieldName: sectionName,
        sectionId: jaenSection?.id
      }),
    []
  )

  const {jaenPage} = usePageContext()

  if (!jaenPage.id) {
    throw new Error(
      'JaenPage id is undefined! connectField must be used within a JaenPage'
    )
  }

  const staticSection = React.useMemo(
    () => findSection(jaenPage.sections || [], sectionPath),
    [jaenPage.sections, sectionPath]
  )

  const dynamicSection = useAppSelector(
    state =>
      findSection(
        state.page.pages.nodes[jaenPage.id]?.sections || [],
        sectionPath
      ),
    (l, r) => {
      if (forceUpdate) {
        return false
      }

      if (l === null && r === null) {
        return true
      }

      if (l === null || r === null) {
        return false
      }

      const shouldUpdate =
        JSON.stringify(Object.keys(l.items)) !==
        JSON.stringify(Object.keys(r.items))

      if (shouldUpdate) {
        return false
      }

      for (let i = 0; i < l.items.length; i++) {
        const lItem = l.items[i]
        const rItem = r.items[i]

        // check if deleted is not equal
        if (lItem?.deleted !== rItem?.deleted) {
          return false
        }
      }

      return true
    }
  )

  const section = React.useMemo(() => {
    const mergedSection = deepmerge(staticSection || {}, dynamicSection || {}, {
      arrayMerge: deepmergeArrayIdMerge
    })

    const sectionItemsDict: Record<string, IJaenBlock> = {}

    mergedSection?.items?.forEach(item => {
      sectionItemsDict[item.id] = item
    })

    const orderedSectionItems: IJaenBlock[] = []

    let ptrHead = mergedSection?.ptrHead

    let i = 0

    while (ptrHead && i < 50) {
      const item = sectionItemsDict[ptrHead]

      if (item == null) {
        throw new Error(`ptrHead ${ptrHead} is not found in section items!`)
      }

      i++

      ptrHead = item.ptrNext

      if (item.deleted) {
        continue
      }

      orderedSectionItems.push(item)
    }

    mergedSection.items = orderedSectionItems

    return mergedSection
  }, [staticSection, dynamicSection])

  return {
    data: section,
    sectionPath
  }
}
