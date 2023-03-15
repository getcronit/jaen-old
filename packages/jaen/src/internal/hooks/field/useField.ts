import React from 'react'

import {IJaenPage} from '../../../types'
import {usePageContext} from '../../context/PageProvider.js'
import {useSectionBlockContext} from '../../context/SectionBlockContext.js'
import {findSection} from '../../helper/page/section.js'
import {RootState, store} from '../../redux/index.js'
import {actions} from '../../redux/slices/page.js'
import {useStatus} from '../useStatus.js'

export function useField<IValue>(name: string, type: string) {
  const {jaenPage} = usePageContext()

  if (!jaenPage.id) {
    throw new Error(
      'JaenPage id is undefined! connectField must be used within a JaenPage'
    )
  }

  const SectionBlockContext = useSectionBlockContext()

  function getPageField(
    page: IJaenPage | Partial<IJaenPage> | null
  ): IValue | undefined {
    if (page) {
      let fields

      if (SectionBlockContext == null) {
        fields = page.jaenFields
      } else {
        fields = findSection(
          page.sections || [],
          SectionBlockContext.path
        )?.items.find(({id}) => id === SectionBlockContext.id)?.jaenFields
      }

      return fields?.[type]?.[name]?.value
    }

    return undefined
  }

  const getValue = () => {
    const state = store.getState() as RootState

    const page = state.page.pages.nodes[jaenPage.id]

    if (page) {
      return getPageField(page)
    }

    return undefined
  }

  const getStaticValue = () => {
    const page = jaenPage

    if (page) {
      return getPageField(page)
    }

    return undefined
  }

  const [value, setValue] = React.useState<IValue | undefined>(getValue)

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newValue = getValue()

      if (newValue !== value) {
        setValue(newValue)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [value])

  const staticValue = getStaticValue()

  const {isEditing} = useStatus()

  const write = React.useCallback(
    (newValue: IValue | null) => {
      store.dispatch(
        actions.field_write({
          pageId: jaenPage.id,
          section: SectionBlockContext
            ? {
                path: SectionBlockContext.path,
                id: SectionBlockContext.id
              }
            : undefined,
          fieldType: type,
          fieldName: name,
          value: newValue
        })
      )
    },
    [jaenPage.id, SectionBlockContext, type, name, value]
  )

  const register = React.useCallback(
    (props: object) => {
      store.dispatch(
        actions.field_register({
          pageId: jaenPage.id,
          fieldType: type,
          fieldName: name,
          section: SectionBlockContext
            ? {
                path: SectionBlockContext.path,
                id: SectionBlockContext.id
              }
            : undefined,
          props
        })
      )
    },
    [jaenPage.id, SectionBlockContext, type, name]
  )

  return {
    value,
    staticValue,
    jaenPageId: jaenPage.id,
    isEditing,
    SectionBlockContext,
    write,
    register
  }
}
