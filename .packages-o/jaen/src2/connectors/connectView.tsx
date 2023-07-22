import * as React from 'react'
import {IJaenConnection} from '../types.js'

export interface ViewOptions {
  path: string
  label: string
  heading?: string
  Icon: React.ComponentType<{}>
  controls?: React.ReactNode[]
  fullscreen?: boolean
}

export const ViewContext = React.createContext<{} | undefined>(undefined)

export interface ViewProviderProps extends ViewOptions {}

export const ViewProvider: React.FC<
  React.PropsWithChildren<ViewProviderProps>
> = ({children}) => {
  return <ViewContext.Provider value={{}}>{children}</ViewContext.Provider>
}

export const connectView = <P extends {}>(
  Component: React.ComponentType<P>,
  options: ViewOptions
) => {
  const MyComp: IJaenConnection<P, typeof options> = props => {
    return (
      <ViewProvider {...options}>
        <Component {...props} />
      </ViewProvider>
    )
  }

  MyComp.options = options

  return MyComp
}

export type IViewConnection = ReturnType<typeof connectView>
