import {Center, CircularProgress} from '@chakra-ui/react'
import {RouteComponentProps, Router} from '@reach/router'
import {navigate} from 'gatsby'
import {useEffect} from 'react'
import {PageProps} from '../types.js'
import {usePromiseEffect} from '../utils/hooks/usePromiseEffect.js'
import {useSiteContext} from './context/SiteContext.js'
import {useDynamicPaths} from './hooks/routing/useDynamicPaths.js'
import {useJaenTemplates} from './hooks/site/useJaenTemplates.js'

const Dynamic = (props: RouteComponentProps & Partial<PageProps>) => {
  const dynamicPaths = useDynamicPaths()

  const path = props.location?.hash?.substring(1)

  const loadingComponent = (
    <Center my="24">
      <CircularProgress isIndeterminate />
    </Center>
  )

  const TemplateLoader = ({path}: {path: string}) => {
    const dynamicPath = dynamicPaths[path]

    if (!dynamicPath) {
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
          navigate(newPath)
        } else {
          // Page has been deleted, redirect to the parent page
          navigate('/')
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
      console.log(`Dynamic `, {
        path,
        dynamicPaths,
        dynamicPath,
        pageId,
        templateName,
        template
      })
      if (template) {
        // TODO: Remove this hack to ignore incorrect template names
        return await templateLoader(templateName)
      }

      return null
    }, [template])

    if (!Component) {
      return loadingComponent
    }

    return (
      <Component
        {...(props as any)}
        pageContext={{...props.pageContext, jaenPageId: pageId}}
        data={{...props.data, jaenPage: null}}
      />
    )
  }

  console.log(`Dynamic `, {path, dynamicPaths})

  if (!path || !dynamicPaths[path]) {
    return loadingComponent
  }

  return <TemplateLoader path={path} />
}
export const RoutingPage = () => {
  if (typeof window !== 'undefined') {
    return (
      <Router primary={false}>
        <Dynamic path="/r" />
      </Router>
    )
  }

  return null
}

export default RoutingPage
