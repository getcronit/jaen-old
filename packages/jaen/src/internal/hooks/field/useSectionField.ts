import {useMemo} from 'react'

import {
  IBlockConnection,
  IBlockOptions
} from '../../../connectors/connectBlock.js'
import {IJaenConnection, IJaenSection} from '../../../types.js'
import {usePageContext} from '../../context/PageProvider.js'
import {store} from '../../redux/index.js'
import {actions} from '../../redux/slices/page.js'
import {useSectionData} from '../page/useSectionData.js'

export interface UseSectionField {
  onSectionAdd: (
    sectionItemType: string,
    between: [string | null, string | null]
  ) => void
  onSectionDelete: (
    id: string,
    ptrPrev: string | null,
    ptrNext: string | null
  ) => void
  onSectionAppend: (
    sectionName: string,
    id: string,
    ptrNext: string | null
  ) => void
  onSectionPrepend: (
    sectionName: string,
    id: string,
    ptrPrev: string | null
  ) => void
  section: IJaenSection
  sectionsDict: Record<
    string,
    {
      Component: IJaenConnection<{}, IBlockOptions>
      options: {
        displayName: string
        name: string
      }
    }
  >
  sectionPath: Array<{
    fieldName: string
    sectionId?: string | undefined
  }>
}

export interface UseSectionFieldOptions {
  sectionName: string
  blocks: IBlockConnection[]
}

export const useSectionField = ({
  sectionName,
  blocks
}: UseSectionFieldOptions): UseSectionField => {
  const {jaenPage} = usePageContext()

  const {data: section, sectionPath} = useSectionData(sectionName)

  // sections to dictionary with key as section name
  const sectionsDict = useMemo<
    Record<
      string,
      {
        Component: IBlockConnection
        options: {
          displayName: string
          name: string
        }
      }
    >
  >(() => {
    const t = blocks.reduce<
      Record<
        string,
        {
          Component: IBlockConnection
          options: {displayName: string; name: string}
        }
      >
    >(
      (acc, Section) => ({
        ...acc,
        [Section.options.name]: {
          Component: Section,
          options: Section.options
        }
      }),
      {}
    )

    return t
  }, [blocks])

  const onSectionAdd = (
    sectionItemType: string,
    between: [string | null, string | null]
  ) => {
    store.dispatch(
      actions.section_add({
        pageId: jaenPage.id,
        sectionItemType,
        path: sectionPath,
        between
      })
    )
  }

  const onSectionDelete = (
    id: string,
    ptrPrev: string | null,
    ptrNext: string | null
  ) => {
    store.dispatch(
      actions.section_remove({
        pageId: jaenPage.id,
        sectionId: id,
        path: sectionPath,
        between: [ptrPrev, ptrNext]
      })
    )
  }

  const onSectionAppend = (
    sectionName: string,
    id: string,
    ptrNext: string | null
  ) => {
    onSectionAdd(sectionName, [id, ptrNext || null])
  }

  const onSectionPrepend = (
    sectionName: string,
    id: string,
    ptrPrev: string | null
  ) => {
    onSectionAdd(sectionName, [ptrPrev || null, id])
  }

  return {
    onSectionAdd,
    onSectionDelete,
    onSectionAppend,
    onSectionPrepend,
    section,
    sectionsDict,
    sectionPath
  }
}
