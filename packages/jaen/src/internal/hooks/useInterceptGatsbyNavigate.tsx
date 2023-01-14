import {NavigateFn} from '@reach/router'
import {useEffect} from 'react'
import {RootState, store} from '../redux/index.js'

export function useInterceptGatsbyNavigate() {
  useEffect(() => {
    const originalNavigate = window.___navigate

    const jaenNavigate: NavigateFn = async (to, options) => {
      if (typeof to === 'string') {
        const state = store.getState() as RootState

        const dynamicPaths = state.page.routing.dynamicPaths

        const pathWithTrailingSlash = to.endsWith('/') ? to : `${to}/`

        const pageId = dynamicPaths[pathWithTrailingSlash]

        if (pageId) {
          to = `/r#${pathWithTrailingSlash}`
        }

        await originalNavigate(to, options)
        return
      }

      await originalNavigate(to, undefined)
    }

    window.___navigate = jaenNavigate
  })
}
