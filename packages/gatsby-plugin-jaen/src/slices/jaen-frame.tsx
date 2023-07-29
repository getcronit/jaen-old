import {PageConfig, useAuthenticationContext} from '@snek-at/jaen'

import Logo from '../components/Logo'

import {graphql, SliceComponentProps} from 'gatsby'

import JaenFrame from '../components/JaenFrame/JaenFrame'
import {useEffect, useMemo} from 'react'
import {NavigationGroupsProps} from '../components/JaenFrame/components/NavigationGroups'
import {FaSitemap} from 'react-icons/fa'

const Slice: React.FC<
  SliceComponentProps<
    {
      allSitePage: {
        nodes: Array<{
          id: string
          path: string
          pageContext: {
            pageConfig: PageConfig
          }
        }>
      }
    },
    {},
    {
      jaenPageId: string
      pageConfig: any
    }
  >
> = props => {
  const authentication = useAuthenticationContext()

  const {navigationGroups} = useMemo(() => {
    const sortedNodes = props.data.allSitePage.nodes.sort((a, b) => {
      const aOrder = a.pageContext.pageConfig?.menu?.order || 0
      const bOrder = b.pageContext.pageConfig?.menu?.order || 0
      return aOrder - bOrder
    })

    const navigationGroups: {
      app: NavigationGroupsProps['groups']
      user: NavigationGroupsProps['groups']
    } = {
      app: {},
      user: {}
    }

    sortedNodes.forEach(node => {
      const config = node.pageContext.pageConfig

      if (!config?.menu) return

      const group = config.menu.group || 'default'

      const groupType = config.menu.type === 'app' ? 'app' : 'user'

      if (!navigationGroups[groupType][group]) {
        navigationGroups[groupType][group] = {
          label: config.menu.groupLabel,
          items: {}
        }
      }

      navigationGroups[groupType]![group]!.items[node.id] = {
        label: config.label,
        path: node.path,
        icon: config.icon ? require('react-icons/fa')[config.icon] : undefined
      }
    })

    return {navigationGroups}
  }, [props.data.allSitePage.nodes])

  return (
    <JaenFrame
      navigation={{
        isStickyDisabled: props.pageConfig.withoutJaenFrameStickyHeader,
        app: {
          navigationGroups: navigationGroups.app,
          version: '3.0.0',
          logo: <Logo />
        },
        user: {
          user: authentication.user
            ? {
                username: authentication.user?.username,
                firstName: authentication.user.details?.firstName,
                lastName: authentication.user.details?.lastName
              }
            : {
                username: 'Guest'
              },
          navigationGroups: navigationGroups.user
        },
        addMenu: {
          items: {
            addPage: {
              label: 'New page',
              icon: FaSitemap,
              path: props.jaenPageId
                ? `/cms/pages/new/#${btoa(props.jaenPageId)}`
                : '/cms/pages/new/'
            }
          }
        },
        breadcrumbs: {
          links: props.pageConfig.breadcrumbs || []
        }
      }}
      logo={<Logo />}
    />
  )
}

export default Slice

export const query = graphql`
  query {
    allSitePage {
      nodes {
        id
        path
        pageContext
      }
    }
  }
`
