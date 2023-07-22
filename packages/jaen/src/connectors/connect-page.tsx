import {PageProvider} from '../contexts/page'
import {IJaenConnection, PageProps} from '../types'

/**
 * Connects a Gatsby page with Jaen, a content management system.
 *
 * This function enables you to wrap a Gatsby page with Jaen-specific functionality and configurations.
 *
 * @template P - The type of props that the connected component receives.
 * @param {React.ComponentType<P>} Component - The Gatsby page component to wrap with Jaen functionality.
 * @param {{ label: string, children?: string[] }} options - Configuration options for the page.
 * @returns {React.ComponentType<IJaenConnection<P, typeof options>>} The wrapped page component.
 *
 * @example
 * // Example usage of connectPage:
 * export default connectPage(
 *   p => {
 *     return (
 *       <>
 *         <h1>My Gatsby Page</h1>
 *         <p>{JSON.stringify(p)}</p>
 *       </>
 *     )
 *   },
 *   {
 *     label: 'Simple Gatsby Page',
 *     children: [],
 *   }
 * );
 *
 * // Example usage of GraphQL query:
 * export const query = graphql`
 *   query($jaenPageId: String!) {
 *     ...JaenPageData
 *   }
 * `
 *
 * @remark
 * - This component must be used in conjunction with the specified GraphQL query.
 */
export const connectPage = <P extends PageProps>(
  Component: React.ComponentType<P>,
  options: {
    /**
     * A label for the Gatsby page, used for identification or display purposes.
     */
    label: string
    /**
     * An optional array of strings representing the children of the page.
     */
    children?: string[]
  }
) => {
  /**
   * Internal component that wraps the provided `Component` with Jaen-related functionality.
   *
   * @param {IJaenConnectionProps<P, typeof options>} props - Props passed to the component.
   * @returns {JSX.Element} The wrapped component with Jaen functionality.
   * @private
   */
  const MyComp: IJaenConnection<P, typeof options> = props => {
    const jaenPage = {
      id: props.pageContext.jaenPageId,
      ...props.data?.jaenPage
    }

    return (
      <PageProvider
        jaenPage={jaenPage}
        jaenPages={props.data.allJaenPage?.nodes}>
        <Component {...props} />
      </PageProvider>
    )
  }

  // Attach options to the wrapped component for future reference.
  MyComp.options = options

  return MyComp
}

/**
 * The type representing the return value of the `connectPage` function.
 *
 * @typedef {React.ComponentType<IJaenConnection<P, typeof options>>} IPageConnection
 * @template P - The type of props that the connected component receives.
 */
export type IPageConnection = ReturnType<typeof connectPage>
