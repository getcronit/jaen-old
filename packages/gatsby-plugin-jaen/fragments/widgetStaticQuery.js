import {graphql, useStaticQuery} from 'gatsby'

export const useWidgetStaticQuery = () => {
  let staticData

  try {
    staticData = useStaticQuery(graphql`
      query WidgetStaticQuery {
        jaenInternal {
          widgets {
            name
            data
          }
        }
      }
    `)
  } catch (e) {
    staticData = {
      jaenInternal: {
        widgets: []
      }
    }
  }

  return staticData
}
