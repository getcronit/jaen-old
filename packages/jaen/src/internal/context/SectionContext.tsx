import * as React from 'react'
import {useAppDispatch} from '../redux'
import {internalActions} from '../../redux/slices'
import type {SectionType} from '../../types.js'
import {usePageContext} from './PageProvider.js'

export const SectionOptionsContext =
  React.createContext<{name: string; displayName: string} | undefined>(
    undefined
  )

export const SectionContext =
  React.createContext<
    | (SectionType & {
        register: (props: object) => void
      })
    | undefined
  >(undefined)

export const JaenSectionProvider = React.memo<
  SectionType & {
    children?: React.ReactNode
  }
>(({path, id, position, Component, children}) => {
  const {jaenPage} = usePageContext()
  const dispatch = useAppDispatch()

  const register = React.useCallback(
    (props: object) => {
      dispatch(
        internalActions.section_register({
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
      {Component ? <Component /> : null}
      {children}
    </SectionContext.Provider>
  )
})

/**
 * Access the SectionContext.
 *
 * @example
 * ```
 * const { name } = useSectionContext()
 * ```
 */
export const useSectionContext = () => {
  const context = React.useContext(SectionContext)

  return context
}
