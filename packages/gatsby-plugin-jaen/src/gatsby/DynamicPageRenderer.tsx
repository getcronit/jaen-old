import {JaenPage, PageProvider, useDynamicPaths} from '@snek-at/jaen'
import {withRedux} from '@snek-at/jaen/src/redux'

import {PageProps} from 'gatsby'
import React, {lazy, useMemo} from 'react'
import {useJaenPagePaths} from './jaen-page-paths'

export interface DynamicPageRendererProps {
  pageProps: PageProps<
    {
      jaenPage?: JaenPage
      allJaenPage?: {
        nodes: Array<JaenPage>
      }
    },
    {
      jaenPageId?: string
    }
  >
  Component: React.ComponentType<any>
}

export const DynamicPageRenderer: React.FC<DynamicPageRendererProps> =
  withRedux(({Component, ...props}) => {
    const allJaenPagePaths = useJaenPagePaths() // Replace this with the actual hook you're using

    const paths = useDynamicPaths() // Replace this with the actual hook you're using

    const pathWithTrailingSlash = props.pageProps.location.pathname.endsWith(
      '/'
    )
      ? props.pageProps.location.pathname
      : props.pageProps.location.pathname + '/'

    const dynamicJaenPage = paths[pathWithTrailingSlash]

    const dynamic = useMemo(() => {
      if (!dynamicJaenPage) return null

      const relativePath = allJaenPagePaths.allJaenTemplate.nodes.find(
        node => node.id === dynamicJaenPage.jaenTemplateId
      )?.relativePath

      return {
        jaenPageId: dynamicJaenPage.jaenPageId,
        Component: lazy(
          () => import(`${__JAEN_SOURCE_TEMPLATES__}/${relativePath}`)
        )
      }
    }, [dynamicJaenPage])

    if (dynamic) {
      return (
        <PageProvider jaenPage={{id: dynamic.jaenPageId}}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Component
              {...props}
              pageContext={{
                jaenPageId: dynamic.jaenPageId
              }}>
              <dynamic.Component
                {...{
                  pageContext: {
                    jaenPageId: dynamic.jaenPageId
                  }
                }}
              />
            </Component>
          </React.Suspense>
        </PageProvider>
      )
    }

    if (props.pageProps.pageContext.jaenPageId) {
      return (
        <PageProvider
          jaenPage={{
            id: props.pageProps.pageContext.jaenPageId,
            ...props.pageProps.data?.jaenPage
          }}
          jaenPages={props.pageProps.data?.allJaenPage?.nodes || []}>
          <Component {...props} />
        </PageProvider>
      )
    }

    return <Component {...props} />
  })
