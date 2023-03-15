import {HashRouter} from 'react-router-dom'
import {useCustomViews} from '../../../hooks/useCustomViews.js'
import {
  buildFromViews,
  BuiltViews,
  View
} from './buildItemAndRoutesFromViews.js'

export interface WithAdminWrapperProps {
  routes: BuiltViews['routes']
  items: BuiltViews['items']
}

export function withAdminPageWrapper<P>(
  // Then we need to type the incoming component.
  // This creates a union type of whatever the component
  // already accepts AND our extraInfo prop
  WrappedComponent: React.ComponentType<P & WithAdminWrapperProps>
) {
  const ComponentWithExtraInfo = ({
    views,
    ...props
  }: P & {
    views: View[]
  }) => {
    if (typeof window === 'undefined') {
      return null
    }

    // At this point, the props being passed in are the original props the component expects.

    const {isLoading, customViews} = useCustomViews()

    if (isLoading) {
      console.info(`Loading custom views...`)
    } else {
      console.info(`Custom views loaded.`)
    }

    views = views.concat(customViews)

    const builtViews = buildFromViews(views)

    return (
      <HashRouter>
        <WrappedComponent
          {...(props as P)}
          routes={builtViews.routes}
          items={builtViews.items}
        />
      </HashRouter>
    )
  }
  return ComponentWithExtraInfo
}
