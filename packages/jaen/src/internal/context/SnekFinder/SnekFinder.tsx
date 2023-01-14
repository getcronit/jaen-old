import {OSGBackend} from '@jaenjs/snek-finder/dist/backends/OSGBackend'
import React from 'react'
import {useAdminStaticQuery} from '../../hooks/useAdminStaticQuery.js'

const SnekFinderProvider = React.lazy(
  async () =>
    await import('@jaenjs/snek-finder').then(module => ({
      default: module.SnekFinderProvider
    }))
)

export const Backend = new OSGBackend('snek-finder-osg-backend-root')

export const SnekFinder: React.FC<React.PropsWithChildren> = ({children}) => {
  const isSSR = typeof window === 'undefined'

  const {
    jaenInternal: {finderUrl}
  } = useAdminStaticQuery()

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
