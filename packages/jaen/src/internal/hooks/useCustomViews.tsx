import * as React from 'react'
import {IViewConnection} from '../../connectors/connectView.js'
import {IJaenView} from '../../types.js'
import {ViewLayout} from '../components/organisms/ViewLayout/index.js'
import {viewLoader} from '../helper/componentLoader.js'
import {useAdminStaticQuery} from './useAdminStaticQuery.js'

const withCustomViewLayout = (Component: IViewConnection) => {
  return (props: any) => {
    return (
      <ViewLayout>
        <Component {...props} />
      </ViewLayout>
    )
  }
}

const normalizePath = (path: string) => {
  return path.replace(/\/+/g, '/')
}

export const useCustomViews = () => {
  const staticData = useAdminStaticQuery()

  const [customViews, setCustomViews] = React.useState<IJaenView[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const nodes = staticData.jaenView.nodes

    const loadViews = async () => {
      setIsLoading(true)

      const alreadyTakenPaths = new Set<string>()

      const views = await Promise.all(
        nodes.map(async ({relativePath}) => {
          const Connection = await viewLoader(relativePath)

          const view: IJaenView = {
            path: normalizePath(`/views/${Connection.options.path}`),
            Component: withCustomViewLayout(Connection),
            label: Connection.options.label,
            group: 'Views',
            Icon: Connection.options.Icon || null,
            hasRoutes: true // assume that the view uses the <Routes> component to render its routes
          }

          if (alreadyTakenPaths.has(view.path)) {
            throw new Error(
              `The path "${view.path}" is already taken by another view. Please change the path of the view "${view.label}".`
            )
          }

          alreadyTakenPaths.add(view.path)

          return view
        })
      )

      setCustomViews(views)
      setIsLoading(false)
    }

    void loadViews()

    console.log('this loops')
  }, [staticData])

  return {
    customViews,
    isLoading
  }
}
