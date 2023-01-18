import {graphql, useStaticQuery} from 'gatsby'

export const usePopupStaticQuery = () => {
  let staticData

  try {
    staticData = useStaticQuery(graphql`
      query PopupStaticQuery {
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
    staticData = {
      jaenPopup: {
        nodes: []
      },
      allJaenPopup: {
        nodes: []
      }
    }
  }

  return staticData
}
