import {PageProvider} from '../contexts/page'
import {IJaenConnection, PageProps} from '../types'

/**
 * Connects a Gatsby template with Jaen, a content management system.
 *
 * This function allows you to wrap a Gatsby template with Jaen-specific functionality and configurations.
 *
 * @template P - The type of props that the connected component receives.
 * @param {React.ComponentType<P>} Component - The template page to wrap with Jaen functionality.
 * @param {ITemplateOptions} options - Configuration options for the template.
 * @returns {React.ComponentType<IJaenConnection<P, typeof options>>} The wrapped template component.
 *
 * @example
 * // Example usage of connectTemplate:
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
 *     label: 'Simple Blog Page',
 *     children: [],
 *     isRootTemplate: true,
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
export const connectTemplate = <P extends PageProps>(
  Component: React.ComponentType<P>,
  options: ITemplateOptions
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
 * Configuration options for the Gatsby template.
 *
 * @interface ITemplateOptions
 */
export interface ITemplateOptions {
  /**
   * A label for the Gatsby template, used for identification or display purposes.
   */
  label: string
  /**
   * An array of strings representing the children of the template.
   */
  children: string[]
  /**
   * Indicates if the template is a root template. Defaults to `false`.
   */
  isRootTemplate?: boolean
}

/**
 * The type representing the return value of the `connectTemplate` function.
 *
 * @typedef {React.ComponentType<IJaenConnection<P, typeof options>>} ITemplateConnection
 * @template P - The type of props that the connected component receives.
 */
export type ITemplateConnection = ReturnType<typeof connectTemplate>
