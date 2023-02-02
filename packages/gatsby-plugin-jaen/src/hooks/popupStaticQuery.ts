import {graphql, useStaticQuery} from 'gatsby'

export const usePopupStaticQuery = () => {
  let staticData

  try {
    staticData = useStaticQuery<{
      jaenPopup: {
        nodes: Array<{
          name: string
          relativePath: string
        }>
      }
      allJaenPopup: {
        nodes: Array<{
          id: string
          active: boolean
          jaenFields: object
        }>
      }
    }>(graphql`
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
