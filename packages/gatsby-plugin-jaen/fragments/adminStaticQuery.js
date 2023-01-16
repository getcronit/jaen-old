import {graphql, useStaticQuery} from 'gatsby'

export const useAdminStaticQuery = () => {
  let staticData

  try {
    staticData = useStaticQuery(graphql`
      query AdminStaticQuery {
        jaenInternal {
          finderUrl
        }
        allJaenPage {
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
          nodes {
            id
            active
            jaenFields
          }
        }
      }
    `)
  } catch (e) {
    console.error('useStaticJaenPages', e)
    staticData = {
      jaenInternal: {
        finderUrl: null
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
