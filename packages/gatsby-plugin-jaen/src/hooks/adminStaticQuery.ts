import {graphql, useStaticQuery} from 'gatsby'

export const useAdminStaticQuery = <JaenSiteMetadata, JaenPageNode>() => {
  let staticData

  try {
    staticData = useStaticQuery<{
      jaenInternal: {
        finderUrl: string | null
        migrationHistory: Array<{
          createdAt: string
          fileUrl: string
        }>
        siteMetadata: Partial<JaenSiteMetadata>
      }
      allJaenPage: {
        totalCount: number
        nodes: JaenPageNode[]
      }
      allJaenPopup: {
        totalCount: number
        nodes: Array<{
          id: string
          active: boolean
          jaenFields: object
        }>
      }
      jaenTemplate: {
        nodes: Array<{
          name: string
          relativePath: string
        }>
      }
      jaenView: {
        nodes: Array<{
          name: string
          relativePath: string
        }>
      }
    }>(graphql`
      query AdminStaticQuery {
        jaenInternal {
          finderUrl
          migrationHistory {
            createdAt
            fileUrl
          }
          siteMetadata {
            ...JaenSiteMetadataData
          }
        }
        allJaenPage {
          totalCount
          nodes {
            ...JaenPageData
            parent {
              id
            }
            children {
              id
            }
            template
            componentName
          }
        }
        jaenTemplate: allFile(
          filter: {sourceInstanceName: {eq: "jaen-templates"}}
        ) {
          nodes {
            name
            relativePath
          }
        }
        jaenView: allFile(filter: {sourceInstanceName: {eq: "jaen-views"}}) {
          nodes {
            name
            relativePath
          }
        }
        jaenPopup: allFile(filter: {sourceInstanceName: {eq: "jaen-popups"}}) {
          nodes {
            name
            relativePath
          }
        }
        allJaenPopup {
          totalCount
          nodes {
            id
            active
            jaenFields
          }
        }
      }
    `)
  } catch (e) {
    staticData = {
      site: {
        siteMetadata: {}
      },
      jaenInternal: {
        finderUrl: null,
        migrationHistory: [],
        widgets: []
      },
      allJaenPage: {
        nodes: []
      },
      jaenTemplate: {
        nodes: []
      },
      jaenView: {
        nodes: []
      },
      jaenNotification: {
        nodes: []
      },
      allJaenNotification: {
        nodes: []
      }
    }
  }

  return staticData
}
