import { graphql, useStaticQuery } from "gatsby"

export function useSite() {
  return useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
}
