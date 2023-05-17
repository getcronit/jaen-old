import {Center, CircularProgress} from '@chakra-ui/react'
import {navigate} from 'gatsby'
import {useEffect, useState} from 'react'
import {PageProps} from '../types.js'
import {usePromiseEffect} from '../utils/hooks/usePromiseEffect.js'
import {useSiteContext} from './context/SiteContext.js'
import {useDynamicPaths} from './hooks/routing/useDynamicPaths.js'
import {useJaenTemplates} from './hooks/site/useJaenTemplates.js'

export const DynamicRoute = (props: PageProps) => {
  const dynamicPaths = useDynamicPaths()

  // add trailing slash if not present
  const path = props.path.endsWith('/') ? props.path : `${props.path}/`

  const loadingComponent = (
    <Center my="24">
      <CircularProgress isIndeterminate />
    </Center>
  )

  console.log('Dynamic', dynamicPaths, path)

  const TemplateLoader = ({path}: {path: string}) => {
    const dynamicPath = dynamicPaths[path]

    if (dynamicPath == null) {
      return null
    }

    const {pageId, templateName} = dynamicPath

    const {templateLoader} = useSiteContext()

    useEffect(() => {
      if (!(path in dynamicPaths)) {
        const newPath = Object.keys(dynamicPaths).find(
          path => dynamicPaths[path]?.pageId === pageId
        )

        if (newPath) {
          // Page has been moved, update to the new path
          void navigate(newPath)
        } else {
          // Page has been deleted, redirect to the parent page
          void navigate('/')
        }
      }
    }, [dynamicPaths])

    const {templates} = useJaenTemplates()

    // We need to wait for the template to be loaded before we can render the page,
    // so template null means the template is not loaded yet
    const template = templates
      ? templates.find(t => t.name === templateName)
      : null

    const {value: Component} = usePromiseEffect(async () => {
      if (template) {
        // TODO: Remove this hack to ignore incorrect template names
        return await templateLoader(templateName)
      }

      return null
    }, [template])

    if (Component == null) {
      return loadingComponent
    }

    return (
      <Component
        {...({} as any)}
        pageContext={{jaenPageId: pageId}}
        data={{jaenPage: null}}
      />
    )
  }

  if (!path || dynamicPaths[path] == null) {
    return loadingComponent
  }

  return <TemplateLoader path={path} />
}

export type DynamicPageProps = PageProps & {
  custom404?: object
}

export const useDynamicRoute = ({pageProps}: {pageProps: DynamicPageProps}) => {
  const [node, setNode] = useState<React.ReactNode>()
  const [isLoading, setIsLoading] = useState(!!pageProps.custom404)

  useEffect(() => {
    // check if 404
    console.log('Page not found', window.location.pathname, pageProps)

    if (pageProps.custom404) {
      console.log(`Setting dynamic route for ${window.location.pathname}`)
      setNode(<DynamicRoute {...pageProps} />)
      setIsLoading(false)
    }
  }, [pageProps.path])

  return {node, isLoading}
}
