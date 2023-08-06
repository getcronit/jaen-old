import {graphql, useStaticQuery} from 'gatsby'

export const useJaenPagePaths = () => {
  return useStaticQuery<{
    allJaenPage: {
      nodes: Array<{
        id: string
        buildPath: string
      }>
    }
    allJaenTemplate: {
      nodes: Array<{
        id: string
        absolutePath: string
        relativePath: string
      }>
    }
  }>(graphql`
    query {
      allJaenPage {
        nodes {
          id
          buildPath
        }
      }
      allJaenTemplate {
        nodes {
          id
          absolutePath
          relativePath
        }
      }
    }
  `)
}
