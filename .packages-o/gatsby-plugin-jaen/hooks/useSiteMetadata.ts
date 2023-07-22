import {graphql, useStaticQuery} from 'gatsby'

export const useSiteMetadata = () => {
  let staticData

  try {
    staticData = useStaticQuery<{
      jaenInternal: {
        siteMetadata?: Record<string, any>
      }
    }>(graphql`
      query {
        jaenInternal {
          siteMetadata {
            ...JaenSiteMetadataData
          }
        }
      }
    `)
  } catch (e) {
    staticData = {
      jaenInternal: {}
    }
  }

  return staticData.jaenInternal.siteMetadata
}
