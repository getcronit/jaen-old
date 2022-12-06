import {PageProvider} from '../internal/context/PageProvider.js'
import {IJaenConnection, PageProps} from '../types.js'

/**
 * @function connectTemplate Connects a gatsby template with Jaen.
 *
 * @param Component The template page to wrap
 * @param {JaenTemplateOptions} templateOptions Configuration for the page
 *
 * Warning: This component must be used in conjunction with the graphql`
 *   query($jaenPageId: String!) {
 *     ...JaenPageData
 *   }
 * ``
 *
 * @example
 * ```
 * export default connectTemplate(
 *   p => {
 *     return (
 *       <>
 *         <h1>Blog</h1>
 *         <p>{JSON.stringify(p)}</p>
 *       </>
 *     )
 *   },
 *   {
 *     displayName: 'Simple Blog Page'
 *   }
 * )
 *
 * export const query = graphql`
 *   query($jaenPageId: String!) {
 *     ...JaenPageData
 *   }
 * `
 * ```
 */

export const connectTemplate = <P extends PageProps>(
  Component: React.ComponentType<P>,
  options: ITemplateOptions
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

export type ITemplateOptions = {
  displayName: string
  children: Array<string>
  isRootTemplate?: boolean
}
export type ITemplateConnection = ReturnType<typeof connectTemplate>
