import {Text} from '@chakra-ui/react'
import * as React from 'react'
import type {SectionType} from '../../types.js'
import {useAppDispatch} from '../redux'
import {actions} from '../redux/slices/page.js'
import {usePageContext} from './PageProvider.js'

export const BlockContext =
  React.createContext<{name: string; displayName: string} | undefined>(
    undefined
  )

export type SectionBlockContextType = SectionType & {
  register: (props: object) => void
}

export const SectionBlockContext =
  React.createContext<SectionBlockContextType | undefined>(undefined)

export const JaenSectionBlockProvider: React.FC<SectionType> = React.memo(
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
      <SectionBlockContext.Provider
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
          <Text>
            <>
              No block component found for section {id} at path {path}. Please
              contact the site administrator.
            </>
          </Text>
        )}
      </SectionBlockContext.Provider>
    )
  }
)

/**
 * Access the SectionBlockContext.
 *
 * @example
 * ```
 * const { name } = useSectionBlockContext()
 * ```
 */
export const useSectionBlockContext = ():
  | SectionBlockContextType
  | undefined => {
  const context = React.useContext(SectionBlockContext)

  return context
}
