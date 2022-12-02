import {useEffect} from 'react'
import {IJaenConnection, PageProps} from '../types.js'
import {PageProvider} from './context/PageProvider.js'
import {
  SectionOptionsContext,
  useSectionContext
} from './context/SectionContext.js'
import {useAuth} from './hooks/auth/useAuth.js'

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

export type ISectionOptions = {displayName: string; name: string}

/**
 * @function connectSection Connects a section with Jaen.
 *
 * @param Component The component to wrap
 */
export const connectSection = <P extends {}>(
  Component: React.ComponentType<P>,
  options: ISectionOptions
) => {
  const MyComp: IJaenConnection<P, typeof options> = props => {
    const section = useSectionContext()

    const {isAuthenticated} = useAuth()

    useEffect(() => {
      if (isAuthenticated && section) {
        // clean up props to prevent circular reference, react items or other issues in redux store / local storage
        //section.register(cleanObject(props))
      }
    }, [])
    return (
      <SectionOptionsContext.Provider value={options}>
        <Component {...props} />
      </SectionOptionsContext.Provider>
    )
  }

  MyComp.options = options

  return MyComp
}
export type ISectionConnection = ReturnType<typeof connectSection>
