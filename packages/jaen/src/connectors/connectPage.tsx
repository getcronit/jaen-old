import {PageProvider} from '../internal/context/PageProvider.js'
import {IJaenConnection, PageProps} from '../types.js'

/**
 * @function connectPage Connects a gatsby page with Jaen.
 *
 * @see {@link connectTemplate} for more information.
 *
 * Warning: This component must be used to wrap a page, not a template.
 */

export const connectPage = <P extends PageProps>(
  Component: React.ComponentType<P>,
  options: {
    displayName: string
    children?: string[]
  }
) => {
  const MyComp: IJaenConnection<P, typeof options> = props => {
    const jaenPage = {
      id: props.pageContext.jaenPageId,
      ...props.data?.jaenPage
    }

    return (
      <>
        {/* <SEO pageMeta={jaenPage.jaenPageMetadata} pagePath={props.path} /> */}
        <PageProvider
          jaenPage={jaenPage}
          jaenPages={props.data.allJaenPage?.nodes}>
          <Component {...props} />
        </PageProvider>
      </>
    )
  }

  MyComp.options = options

  return MyComp
}
export type IPageConnection = ReturnType<typeof connectPage>
