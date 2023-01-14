import {useMemo} from 'react'

import {actions} from '../../redux/slices/page.js'
import {store} from '../../redux/index.js'
import {usePageContext} from '../../context/PageProvider.js'
import {useSectionData} from '../page/useSectionData.js'
import {IJaenConnection, IJaenSection} from '../../../types.js'
import {
  ISectionConnection,
  ISectionOptions
} from '../../../connectors/connectSection.js'

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
      Component: IJaenConnection<{}, ISectionOptions>
      options: {
        displayName: string
        name: string
      }
    }
  >
  sectionPath: {
    fieldName: string
    sectionId?: string | undefined
  }[]
}

export interface UseSectionFieldOptions {
  sectionName: string
  sections: ISectionConnection[]
}

export const useSectionField = ({
  sectionName,
  sections
}: UseSectionFieldOptions): UseSectionField => {
  const {jaenPage} = usePageContext()

  const {data: section, sectionPath} = useSectionData(sectionName)

  // sections to dictionary with key as section name
  const sectionsDict = useMemo<
    Record<
      string,
      {
        Component: IJaenConnection<{}, ISectionOptions>
        options: {
          displayName: string
          name: string
        }
      }
    >
  >(() => {
    return sections.reduce<
      Record<
        string,
        {
          Component: ISectionConnection
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
  }, [sections])

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
