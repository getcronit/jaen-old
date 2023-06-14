import React from 'react'

import {IJaenPage} from '../../../types'
import {usePageContext} from '../../context/PageProvider.js'
import {
  SectionBlockContextType,
  useSectionBlockContext
} from '../../context/SectionBlockContext.js'
import {findSection} from '../../helper/page/section.js'
import {RootState, store} from '../../redux/index.js'
import {actions} from '../../redux/slices/page.js'
import {useStatus} from '../useStatus.js'

export function useField<IValue>(
  name: string,
  type: string,
  block?: {
    path: SectionBlockContextType['path']
    id: SectionBlockContextType['id']
  }
) {
  const {jaenPage} = usePageContext()

  if (!jaenPage.id) {
    throw new Error(
      'JaenPage id is undefined! connectField must be used within a JaenPage'
    )
  }

  const SectionBlockContext = useSectionBlockContext()

  function getPageField(page: IJaenPage | Partial<IJaenPage> | null):
    | {
        value: IValue
        props?: Record<string, any>
        position?: number
      }
    | undefined {
    if (page) {
      let fields

      const path = block?.path || SectionBlockContext?.path
      const blockId = block?.id || SectionBlockContext?.id

      if (path) {
        fields = findSection(page.sections || [], path)?.items.find(
          ({id}) => id === blockId
        )?.jaenFields
      } else {
        fields = page.jaenFields
      }

      return fields?.[type]?.[name]
    }

    return undefined
  }

  const getField = () => {
    const state = store.getState() as RootState

    const page = state.page.pages.nodes[jaenPage.id]

    if (page) {
      return getPageField(page)
    }

    return undefined
  }

  const getStaticField = () => {
    const page = jaenPage

    if (page) {
      return getPageField(page)
    }

    return undefined
  }

  const [field, setField] =
    React.useState<
      | {
          value?: IValue
          props?: Record<string, any>
          position?: number
        }
      | undefined
    >(getField)

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newField = getField()

      if (newField !== field) {
        setField(newField)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [field, store])

  const staticField = getStaticField()

  const {isEditing} = useStatus()

  const props = field?.props || staticField?.props || {}

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
          value: newValue,
          props
        })
      )

      setField({
        ...field,
        value: newValue || undefined
      })
    },
    [jaenPage.id, SectionBlockContext, type, name, field, store, props]
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
    value: field?.value,
    staticValue: staticField?.value,
    props,
    jaenPageId: jaenPage.id,
    isEditing,
    SectionBlockContext,
    write,
    register
  }
}
