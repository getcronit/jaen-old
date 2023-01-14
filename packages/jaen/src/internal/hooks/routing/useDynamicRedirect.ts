import {navigate} from 'gatsby'
import React from 'react'
import {useAppSelector} from '../../redux/index.js'

export const useDynamicRedirect = () => {
  const windowPathname =
    typeof window !== 'undefined' ? window.location.pathname : ''

  const dynamicPaths = useAppSelector(state => state.page.routing.dynamicPaths)

  React.useEffect(() => {
    const withoutTrailingSlash = windowPathname.replace(/\/$/, '')

    const pageId = dynamicPaths[withoutTrailingSlash]

    if (pageId) {
      const withDynamicPrefix = `/r#${withoutTrailingSlash}`

      void navigate(withDynamicPrefix)
    }
  }, [windowPathname])
}
