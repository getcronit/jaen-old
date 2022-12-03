import {useEffect} from 'react'
import {NavigateFn} from '@reach/router'
import {RootState, store} from '../redux/index.js'

export function useInterceptGatsbyNavigate() {
  useEffect(() => {
    const originalNavigate = window.___navigate

    const jaenNavigate: NavigateFn = (to, options) => {
      if (typeof to === 'string') {
        const state = store.getState() as RootState

        const dynamicPaths = state.page.routing.dynamicPaths

        const pathWithTrailingSlash = to.endsWith('/') ? to : `${to}/`

        const pageId = dynamicPaths[pathWithTrailingSlash]

        if (pageId) {
          to = `/r#${pathWithTrailingSlash}`
        }

        return originalNavigate(to, options)
      }

      return originalNavigate(to, undefined)
    }

    window.___navigate = jaenNavigate
  })
}
