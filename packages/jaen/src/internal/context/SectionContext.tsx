import {Text} from '@chakra-ui/react'
import * as React from 'react'
import type {SectionType} from '../../types.js'
import {useAppDispatch} from '../redux'
import {actions} from '../redux/slices/page.js'
import {usePageContext} from './PageProvider.js'

export const SectionOptionsContext =
  React.createContext<{name: string; displayName: string} | undefined>(
    undefined
  )

export type SectionContextType = SectionType & {
  register: (props: object) => void
}

export const SectionContext =
  React.createContext<SectionContextType | undefined>(undefined)

export const JaenSectionProvider: React.FC<SectionType> = React.memo(
  ({path, id, position, Component}) => {
    const {jaenPage} = usePageContext()
    const dispatch = useAppDispatch()

    const register = React.useCallback(
      (props: object) => {
        dispatch(
          actions.section_register({
            pageId: jaenPage.id,
            path,
            props
          })
        )
      },
      [dispatch, jaenPage.id]
    )

    return (
      <SectionContext.Provider
        value={{
          path,
          id,
          position,
          Component,
          register
        }}>
        {Component ? (
          <Component />
        ) : (
          <Text>Section not found. Please contact the site administrator.</Text>
        )}
      </SectionContext.Provider>
    )
  }
)

/**
 * Access the SectionContext.
 *
 * @example
 * ```
 * const { name } = useSectionContext()
 * ```
 */
export const useSectionContext = (): SectionContextType | undefined => {
  const context = React.useContext(SectionContext)

  return context
}
