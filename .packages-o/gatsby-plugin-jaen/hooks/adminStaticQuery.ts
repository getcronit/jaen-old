import {graphql, useStaticQuery} from 'gatsby'

export const useAdminStaticQuery = <JaenSiteMetadata, JaenPageNode>() => {
  let staticData: {
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
  }

  try {
    staticData = useStaticQuery<typeof staticData>(graphql`
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
            ...JaenPageDataStructure
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
    console.log(e)
    staticData = {
      jaenInternal: {
        finderUrl: null,
        migrationHistory: [],
        siteMetadata: {}
      },
      allJaenPage: {
        totalCount: 0,
        nodes: []
      },
      jaenTemplate: {
        nodes: []
      },
      jaenView: {
        nodes: []
      },
      allJaenPopup: {
        totalCount: 0,
        nodes: []
      }
    }
  }

  return staticData
}
