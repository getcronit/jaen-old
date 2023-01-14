import {HashRouter} from 'react-router-dom'
import {useAdminStaticQuery} from '../../../hooks/useAdminStaticQuery.js'
import {
  buildFromViews,
  BuiltViews,
  View
} from './buildItemAndRoutesFromViews.js'

export interface WithAdminRoutingProps {
  routes: BuiltViews['routes']
  items: BuiltViews['items']
}

export function withAdminRouting<P>(
  // Then we need to type the incoming component.
  // This creates a union type of whatever the component
  // already accepts AND our extraInfo prop
  WrappedComponent: React.ComponentType<P & WithAdminRoutingProps>
) {
  const ComponentWithExtraInfo = ({
    views,
    ...props
  }: P & {
    views: View[]
  }) => {
    const data = useAdminStaticQuery()

    console.log(data)

    if (typeof window === 'undefined') {
      return null
    }

    // At this point, the props being passed in are the original props the component expects.

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
