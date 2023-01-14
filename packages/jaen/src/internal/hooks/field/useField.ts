import React from 'react'

import {usePageContext} from '../../context/PageProvider.js'
import {useSectionContext} from '../../context/SectionContext.js'
import {findSection} from '../../helper/page/section.js'
import {IJaenPage} from '../../../types'
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

  const sectionContext = useSectionContext()

  function getPageField(
    page: IJaenPage | Partial<IJaenPage> | null
  ): IValue | undefined {
    if (page) {
      let fields

      if (!sectionContext) {
        fields = page.jaenFields
      } else {
        fields = findSection(
          page.sections || [],
          sectionContext.path
        )?.items.find(({id}) => id === sectionContext.id)?.jaenFields
      }

      return fields?.[type]?.[name]?.value
    }

    return undefined
  }

  const getValue = () => {
    const state = store.getState() as RootState

    console.log('state', state)

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
          section: sectionContext
            ? {
                path: sectionContext.path,
                id: sectionContext.id
              }
            : undefined,
          fieldType: type,
          fieldName: name,
          value: newValue
        })
      )
    },
    [jaenPage.id, sectionContext, type, name, value]
  )

  const register = React.useCallback(
    (props: object) => {
      store.dispatch(
        actions.field_register({
          pageId: jaenPage.id,
          fieldType: type,
          fieldName: name,
          section: sectionContext
            ? {
                path: sectionContext.path,
                id: sectionContext.id
              }
            : undefined,
          props
        })
      )
    },
    [jaenPage.id, sectionContext, type, name]
  )

  return {
    value,
    staticValue,
    jaenPageId: jaenPage.id,
    isEditing,
    sectionContext,
    write,
    register
  }
}
