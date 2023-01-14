import {useEffect} from 'react'
import {
  SectionOptionsContext,
  useSectionContext
} from '../internal/context/SectionContext.js'
import {useAuth} from '../internal/hooks/auth/useAuth.js'
import {IJaenConnection} from '../types.js'

export interface ISectionOptions {
  displayName: string
  name: string
}
/**
 * @function connectSection Connects a section with Jaen.
 *
 * @param Component The component to wrap
 */

export const connectSection = <P extends {}>(
  Component: React.ComponentType<P>,
  options: ISectionOptions
) => {
  const MyComp: IJaenConnection<P, typeof options> = props => {
    const section = useSectionContext()

    const {isAuthenticated} = useAuth()

    useEffect(() => {
      if (isAuthenticated && section) {
        // clean up props to prevent circular reference, react items or other issues in redux store / local storage
        // section.register(cleanObject(props))
      }
    }, [])
    return (
      <SectionOptionsContext.Provider value={options}>
        <Component {...props} />
      </SectionOptionsContext.Provider>
    )
  }

  MyComp.options = options

  return MyComp
}
export type ISectionConnection = ReturnType<typeof connectSection>
