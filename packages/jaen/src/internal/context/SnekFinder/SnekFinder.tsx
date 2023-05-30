import {OSGBackend} from '@snek-at/snek-finder/dist/backends/OSGBackend'
import React from 'react'
import {useAdminStaticQuery} from '../../hooks/useAdminStaticQuery.js'
import {useAppSelector, withRedux} from '../../redux/index.js'

const SnekFinderProvider = React.lazy(
  async () =>
    await import('@snek-at/snek-finder').then(module => ({
      default: module.SnekFinderProvider
    }))
)

export const Backend = new OSGBackend('snek-finder-osg-backend-root')

export const SnekFinder: React.FC<React.PropsWithChildren> = withRedux(
  ({children}) => {
    const isSSR = typeof window === 'undefined'

    const {jaenInternal} = useAdminStaticQuery()

    const dynamicFinderUrl = useAppSelector(state => state.finderUrl)

    const finderUrl = dynamicFinderUrl || jaenInternal.finderUrl

    return (
      <React.Suspense fallback={null}>
        {!isSSR && (
          <SnekFinderProvider
            backend={Backend}
            initDataLink={finderUrl || undefined}>
            {children}
          </SnekFinderProvider>
        )}
      </React.Suspense>
    )
  }
)
