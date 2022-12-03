import React from 'react'
import type {IPageConnection, ITemplateConnection} from '../../connectors.js'
import {withRedux} from '../redux/index.js'
import {pageLoader, templateLoader} from '../helper/componentLoader.js'
import {useDynamicRedirect} from '../hooks/routing/useDynamicRedirect.js'

export interface ISiteContext {
  templateLoader: (name: string) => Promise<ITemplateConnection>
  pageLoader: (name: string) => Promise<IPageConnection>
}

export const SiteContext =
  React.createContext<ISiteContext | undefined>(undefined)

export const SiteProvider: React.FC<React.PropsWithChildren<{}>> = withRedux(
  ({children}) => {
    useDynamicRedirect()

    return (
      <SiteContext.Provider
        value={{
          templateLoader: templateLoader,
          pageLoader: pageLoader
        }}>
        {children}
      </SiteContext.Provider>
    )
  }
)

/**
 * Access the SiteContext.
 *
 * @example
 * ```
 * const { jaen } = useSiteContext()
 * ```
 */
export const useSiteContext = () => {
  const context = React.useContext(SiteContext)

  if (context === undefined) {
    throw new Error('useSiteContext must be within SiteProvider')
  }

  return context
}
