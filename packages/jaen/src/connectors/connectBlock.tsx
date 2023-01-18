import {useEffect} from 'react'
import {
  BlockContext,
  useSectionBlockContext
} from '../internal/context/SectionBlockContext.js'
import {useAuth} from '../internal/hooks/auth/useAuth.js'
import {IJaenConnection} from '../types.js'

export interface IBlockOptions {
  label: string
  name: string
  Icon?: React.ComponentType
}
/**
 * @function connectBlock Connects a block to to section with Jaen.
 *
 * @param Component The component to wrap
 */
export const connectBlock = <P extends {}>(
  Component: React.ComponentType<P>,
  options: IBlockOptions
) => {
  const MyComp: IJaenConnection<P, typeof options> = props => {
    const section = useSectionBlockContext()

    const {isAuthenticated} = useAuth()

    useEffect(() => {
      if (isAuthenticated && section) {
        // clean up props to prevent circular reference, react items or other issues in redux store / local storage
        // section.register(cleanObject(props))
      }
    }, [])
    return (
      <BlockContext.Provider value={options}>
        <Component {...props} />
      </BlockContext.Provider>
    )
  }

  MyComp.options = options

  return MyComp
}
export type IBlockConnection = ReturnType<typeof connectBlock>
